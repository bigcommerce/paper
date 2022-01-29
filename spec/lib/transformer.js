const Code = require('code');
const Lab = require('lab');
const Transformer = require('../../lib/translator/transformer');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

describe('Transformer', () => {
    const translations = {
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

    const flattened = {
        en: {
            welcome: 'Welcome',
            hello: 'Hello {name}',
            bye: 'Bye bye',
            items: '{count, plural, one{1 Item} other{# Items}}',
            'level1.level2': 'we are on the second level'
        },
        fr: {
            hello: 'Bonjour {name}',
            bye: 'au revoir',
            'level1.level2': 'nous sommes dans le deuxième niveau'
        },
        'fr-CA': {
            hello: 'Salut {name}'
        },
        yolo: {
            welcome: 'yolo'
        },
        zh: {
            days: '{count, plural, other{# 天}}'
        }
    };

    const cascaded = {
        en: {
            locale: 'en',
            locales: {
                welcome: 'en',
                hello: 'en',
                bye: 'en',
                items: 'en',
                'level1.level2': 'en'
            },
            translations: {
                welcome: 'Welcome',
                hello: 'Hello {name}',
                bye: 'Bye bye',
                items: '{count, plural, one{1 Item} other{# Items}}',
                'level1.level2': 'we are on the second level'
            }
        },
        fr: {
            locale: 'fr',
            locales: {
                welcome: 'en',
                hello: 'fr',
                bye: 'fr',
                items: 'en',
                'level1.level2': 'fr'
            },
            translations: {
                welcome: 'Welcome',
                hello: 'Bonjour {name}',
                bye: 'au revoir',
                items: '{count, plural, one{1 Item} other{# Items}}',
                'level1.level2': 'nous sommes dans le deuxième niveau'
            }
        },
        'fr-CA': {
            locale: 'fr-CA',
            locales: {
                welcome: 'en',
                hello: 'fr-CA',
                bye: 'fr',
                items: 'en',
                'level1.level2': 'fr'
            },
            translations: {
                welcome: 'Welcome',
                hello: 'Salut {name}',
                bye: 'au revoir',
                items: '{count, plural, one{1 Item} other{# Items}}',
                'level1.level2': 'nous sommes dans le deuxième niveau'
            }
        },
        yolo: {
            locale: 'yolo',
            locales: {
                welcome: 'yolo',
                hello: 'en',
                bye: 'en',
                items: 'en',
                'level1.level2': 'en'
            },
            translations: {
                welcome: 'yolo',
                hello: 'Hello {name}',
                bye: 'Bye bye',
                items: '{count, plural, one{1 Item} other{# Items}}',
                'level1.level2': 'we are on the second level'
            }
        },
        zh: {
            locale: 'zh',
            locales: {
                welcome: 'en',
                hello: 'en',
                bye: 'en',
                items: 'en',
                'level1.level2': 'en',
                days: 'zh'
            },
            translations: {
                welcome: 'Welcome',
                hello: 'Hello {name}',
                bye: 'Bye bye',
                items: '{count, plural, one{1 Item} other{# Items}}',
                'level1.level2': 'we are on the second level',
                days: '{count, plural, other{# 天}}'
            }
        }
    };

    describe('.flatten', done => {
        it('should return object with flattened keys', done => {
            expect(Transformer.flatten(translations, ['en'])).to.equal({ en: flattened['en']});
            done();
        });

        it('should filter based on the languages needed to resolve translations for given preferred locale', done => {
            expect(Transformer.flatten(translations, ['fr-CA', 'fr', 'en'])).to.equal({
                en: flattened['en'],
                fr: flattened['fr'],
                'fr-CA': flattened['fr-CA'],
            });
            done();
        });
    });

    describe('.flatten', done => {
        it('should return object with cascading translations', done => {
            expect(Transformer.cascade(flattened, ['en'])).to.equal(cascaded['en']);
            done();
        });

        it('should return object based on preferred locale', done => {
            expect(Transformer.cascade(flattened, ['zh', 'en'])).to.equal(cascaded['zh']);
            done();
        });
    });

    describe('.transform', done => {
        it('transform should do both flatten and cascade', done => {
            expect(Transformer.transform(translations, ['en'])).to.equal(cascaded['en']);
            done();
        });
    });
});
