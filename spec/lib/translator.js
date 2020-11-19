'use strict';

const Code = require('code');
const Lab = require('lab');
const Sinon = require('sinon');
const Translator = require('../../lib/translator');

const fs = require('fs');
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

describe('Translator', () => {
    let loggerStub;
    let translations;

    beforeEach(done => {
        translations = {
            en: {
                welcome: 'Welcome',
                hello: 'Hello {name}',
                bye: 'Bye bye',
                items: '{count, plural, one{1 Item} other{# Items}}',
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
            zh: {
                days: '{count, plural, other{# 天}}',
            },
        };

        loggerStub = {
            log: Sinon.fake(),
            error: Sinon.fake(),
        };

        done();
    });

    it('should return translated strings', done => {
        const translator = Translator.create('fr-CA', translations);

        expect(translator.translate('hello', { name: 'Joe' })).to.equal('Salut Joe');
        expect(translator.translate('bye')).to.equal('au revoir');
        expect(translator.translate('level1.level2')).to.equal('nous sommes dans le deuxième niveau');

        done();
    });

    it('should return translated strings in default language if it cannot find a translation file for a specified language', done => {
        const translator = Translator.create('fr-FR', translations);

        expect(translator.translate('bye')).to.equal('au revoir');
        expect(translator.translate('hello', { name: 'Joe' })).to.equal('Bonjour Joe');
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
        const nl = {
            bye: 'doei',
            level1: {},
        };

        nl.level1.level2 = nl.level1;

        const translator = Translator.create('nl', Object.assign({}, translations, { nl: nl }), loggerStub);

        expect(translator.translate('bye')).to.equal('Bye bye');
        expect(loggerStub.error.called).to.equal(true);

        done();
    });

    it('should return translated strings in the most region-specific language if possible', done => {
        const translator = Translator.create('fr-CA', translations);

        expect(translator.translate('hello', { name: 'Joe' })).to.equal('Salut Joe'); // Use fr-CA
        expect(translator.translate('bye')).to.equal('au revoir'); // Use fr

        done();
    });

    it('should return an empty string and log a message if missing required parameters', done => {
        const translator = Translator.create('en', translations, loggerStub);

        expect(translator.translate('hello')).to.equal('');
        expect(loggerStub.error.called).to.equal(true);

        done();
    });

    it('should log an error when there is a syntax error in the template', done => {
        const translator = Translator.create('en', {
            en: {
                items_with_syntax_error: '{count, plurral, one{1 Item} other{# Items}}',
            },
        }, loggerStub);

        translator.translate('items_with_syntax_error', { count: 1 });

        expect(loggerStub.error.called).to.equal(true);

        done();
    });

    it('should log an error when there is a syntax error in the template', done => {
        const translator = Translator.create('en', {
            en: {
                gender_error: '{gender, select, male{He} female{She}} liked this.',
            },
        });

        expect(() => translator.translate('gender_error', { gender: 'shemale' })).to.throw(Error);

        done();
    });

    it('should return the translation key if both the preferred and fallback translations are missing', done => {
        const translator = Translator.create('jp', {});

        expect(translator.translate('hello')).to.equal('hello');

        done();
    });

    it('should return pluralized strings according to their language', done => {
        const translator = Translator.create('zh', translations);

        expect(translator.translate('days', { count: 1 })).to.equal('1 天');
        expect(translator.translate('days', { count: 2 })).to.equal('2 天');
        expect(translator.translate('items', { count: 1 })).to.equal('1 Item');
        expect(translator.translate('items', { count: 2 })).to.equal('2 Items');

        done();
    });

    it('should return the current locale name', done => {
        expect(Translator.create('en', translations).getLocale()).to.equal('en');
        expect(Translator.create('fr-CA', translations).getLocale()).to.equal('fr-CA');
        expect(Translator.create('jp', translations).getLocale()).to.equal('en');

        done();
    });

    it('should return a translation object', done => {
        const translator = Translator.create('en', translations);

        expect(translator.getLanguage()).to.equal({
            locale: 'en',
            locales: {
                'level1.level2': 'en',
                bye: 'en',
                hello: 'en',
                items: 'en',
                welcome: 'en',
            },
            translations: {
                'level1.level2': 'we are on the second level',
                bye: 'Bye bye',
                hello: 'Hello {name}',
                items: '{count, plural, one{1 Item} other{# Items}}',
                welcome: 'Welcome',
            },
        });

        done();
    });

    it('should return a cascaded translation object', done => {
        const translator = Translator.create('fr-CA', translations);

        expect(translator.getLanguage()).to.equal({
            locale: 'fr-CA',
            locales: {
                'level1.level2': 'fr',
                bye: 'fr',
                hello: 'fr-CA',
                items: 'en',
                welcome: 'en',
            },
            translations: {
                'level1.level2': 'nous sommes dans le deuxième niveau',
                bye: 'au revoir',
                hello: 'Salut {name}',
                items: '{count, plural, one{1 Item} other{# Items}}',
                welcome: 'Welcome',
            },
        });

        done();
    });

    it('should return a translation object filtered by key', done => {
        const translator = Translator.create('en', translations);

        expect(translator.getLanguage('hello')).to.equal({
            locale: 'en',
            locales: {
                hello: 'en',
            },
            translations: {
                hello: 'Hello {name}',
            },
        });

        expect(translator.getLanguage('level1')).to.equal({
            locale: 'en',
            locales: {
                'level1.level2': 'en',
            },
            translations: {
                'level1.level2': 'we are on the second level',
            },
        });

        done();
    });

    // Lab will output the amount of time spent in this test. We can use it to
    // compare relative speed of different implementations.
    it('load test', { timeout: 5000, skip: true }, done => {
        fs.readFile('./spec/fixtures/lang.json', 'utf8' , (err, data) => {
            if (err) {
                console.error(err);
                throw err;
            }

            translations = data;

            for (let i = 0; i < 1000; i++) {
                Translator.create('fr-CA', translations);
            }
            done();
        });
    });
});
