'use strict';

const Code = require('code');
const Lab = require('lab');
const Sinon = require('sinon');
const Logger = require('../../lib/logger');
const Translator = require('../../lib/translator');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

describe('Translator', () => {
    const translations = {
        en: {
            welcome: 'Welcome',
            hello: 'Hello {name}',
            bye: 'Bye bye',
            level1: {
                level2: 'we are on the second level',
            },
        },
        fr: {
            hello: 'Bonjour {name}',
            bye: 'au revoir',
            level1: {
                level2: 'nous sommes dans le deuxième niveau',
            },
        },
        'fr-CA': {
            hello: 'Salut {name}',
        },
        yolo: {
            welcome: 'yolo',
        },
    };

    it('should return translated strings', done => {
        const translator = Translator.create('fr-CA', translations);

        expect(translator.translate('hello', { name: 'Joe' })).to.equal('Salut Joe');
        expect(translator.translate('bye')).to.equal('au revoir');
        expect(translator.translate('level1.level2')).to.equal('nous sommes dans le deuxième niveau');

        done();
    });

    it('should return translated strings in English if cannot locate the preferred translation file', done => {
        const translator = Translator.create('es', translations);

        expect(translator.translate('welcome')).to.equal('Welcome');
        expect(translator.translate('hello', { name: 'Joe' })).to.equal('Hello Joe');
        expect(translator.translate('level1.level2')).to.equal('we are on the second level');

        done();
    });

    it('should return translated strings in English if the preferred locale name is invalid', done => {
        const translator = Translator.create('yolo', translations);

        expect(translator.translate('welcome')).to.equal('Welcome');
        expect(translator.translate('hello', { name: 'Joe' })).to.equal('Hello Joe');
        expect(translator.translate('level1.level2')).to.equal('we are on the second level');

        done();
    });

    it('should return translated strings in English if specific keys are missing from the preferred translation file', done => {
        const translator = Translator.create('fr-CA', translations);

        expect(translator.translate('welcome')).to.equal('Welcome');

        done();
    });

    it('should return translated strings in English and print to log if the translation file cannot be parsed', done => {
        const loggerStub = Sinon.stub(Logger, 'log');

        const nl = {
            bye: 'doei',
            level1: {},
        };

        nl.level1.level2 = nl.level1;

        const translator = Translator.create('nl', Object.assign({}, translations, { nl: nl }));

        expect(translator.translate('bye')).to.equal('Bye bye');
        expect(loggerStub.called).to.equal(true);

        loggerStub.restore();

        done();
    });

    it('should return translated strings in the most region-specific language if possible', done => {
        const translator = Translator.create('fr-CA', translations);

        expect(translator.translate('hello', { name: 'Joe' })).to.equal('Salut Joe'); // Use fr-CA
        expect(translator.translate('bye')).to.equal('au revoir'); // Use fr

        done();
    });

    it('should return an empty string and log a message if missing required parameters', done => {
        const loggerStub = Sinon.stub(Logger, 'log');
        const translator = Translator.create('en', translations);

        expect(translator.translate('hello')).to.equal('');
        expect(loggerStub.called).to.equal(true);

        loggerStub.restore();

        done();
    });

    it('should log an error when there is a syntax error in the template', done => {
        const errorLoggerStub = Sinon.stub(Logger, 'logError');
        const translator = Translator.create('en', {
            en: {
                items_with_syntax_error: '{count, plurral, one{1 Item} other{# Items}}',
            },
        });

        translator.translate('items_with_syntax_error', { count: 1 });

        expect(errorLoggerStub.called).to.equal(true);

        done();
    });

    it('should return the translation key if both the preferred and fallback translations are missing', done => {
        const translator = Translator.create('jp', {});

        expect(translator.translate('hello')).to.equal('hello');

        done();
    });

    it('should return the current locale name', done => {
        expect(Translator.create('en', translations).getLocaleName()).to.equal('en');
        expect(Translator.create('fr-CA', translations).getLocaleName()).to.equal('fr-CA');
        expect(Translator.create('jp', translations).getLocaleName()).to.equal('en');

        done();
    });

    it('should return a translation object', done => {
        const translator = Translator.create('en', translations);

        expect(translator.getTranslation()).to.deep.equal({
            welcome: 'Welcome',
            hello: 'Hello {name}',
            bye: 'Bye bye',
            'level1.level2': 'we are on the second level',
        });

        done();
    });

    it('should return a translation object filtered by key', done => {
        const translator = Translator.create('en', translations);

        expect(translator.getTranslation('hello')).to.deep.equal({
            hello: 'Hello {name}'
        });

        expect(translator.getTranslation('level1')).to.deep.equal({
            'level1.level2': 'we are on the second level',
        });

        done();
    });
});
