const Code = require('code');
const Lab = require('lab');
const Transformer = require('../../lib/translator/transformer');

const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

describe('Transformer', () => {
    let translations, flattened, cascaded;

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

        flattened = {
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

        cascaded = {
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

        done();
    });

    it('flatten should return object with flattened keys', done => {
        expect(Transformer.flatten(translations)).to.equal(flattened);
        done();
    });

    it('cascade should return object with flattened keys', done => {
        expect(Transformer.cascade(flattened, 'en')).to.equal(cascaded);
        done();
    });

    it('transform should do both flatten and cascade', done => {
        expect(Transformer.transform(translations, 'en')).to.equal(cascaded);
        done();
    });

});
