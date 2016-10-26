const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

const localizer = require('../../lib/localizer');

describe('lib/localizer', () => {
    const translations = {
        en: {
            welcome: 'Welcome',
            hello: 'Hello {name}',
            bye: 'bye',
            level1: {
                level2: 'we are in the second level'
            },
        },
        fr: {
            hello: 'Bonjour {name}',
            bye: 'au revoir',
            level1: {
                level2: 'nous sommes dans le deuxième niveau'
            },
        },
        'fr-CA': {
            hello: 'Salut {name}'
        },
    };

    describe('localize', () => {
        it('should translate to english if the language is not in translations', done => {
            const translator = localizer('es', translations);

            expect(translator).to.be.a.function();
            expect(translator('welcome')).to.be.equal('Welcome');
            expect(translator('hello', {name: 'Joe'})).to.be.equal('Hello Joe');
            expect(translator('level1.level2')).to.be.equal('we are in the second level');

            done();
        });

        it('should translate to the indicated language and default to english', done => {
            const translator = localizer('fr-CA', translations);


            expect(translator).to.be.a.function();
            expect(translator('welcome')).to.be.equal('Welcome');
            expect(translator('hello', {name: 'Joe'})).to.be.equal('Salut Joe');
            expect(translator('level1.level2')).to.be.equal('nous sommes dans le deuxième niveau');

            done();
        });
    });

    describe('internals.getTranslator', () => {
        it('should get a translator function that translates when called', done => {
            const translator = localizer.internals.getTranslator('es', {
                welcome: 'Bienvenido',
                hello: 'Hola {name}',
            });

            expect(translator).to.be.a.function();
            expect(translator('welcome')).to.be.equal('Bienvenido');
            expect(translator('hello', {name: 'Joe'})).to.be.equal('Hola Joe');

            done();
        });
    });

    describe('internals.flattenLocales', () => {
        it('should normalize the object to one level object', done => {
            const flatten = localizer.internals.flattenLocales(translations);

            expect(flatten.en['level1.level2']).to.be.equal(translations.en.level1.level2);
            expect(flatten.fr['level1.level2']).to.be.equal(translations.fr.level1.level2);
            expect(flatten['fr-CA']['hello']).to.be.equal(translations['fr-CA'].hello);

            done();
        });
    });

    describe('internals.cascadeLocales', () => {
        it('should cascades the locales from most specific region to least', done => {
            const cascaded = localizer.internals.cascadeLocales('en', translations);

            expect(cascaded['fr'].welcome).to.be.equal(translations.en.welcome);
            expect(cascaded['fr-CA'].welcome).to.be.equal(translations.en.welcome);
            expect(cascaded['fr-CA'].bye).to.be.equal(translations.fr.bye);
            done();
        });
    });
});
