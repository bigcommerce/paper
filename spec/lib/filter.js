const Code = require('code');
const Lab = require('lab');
const Filter = require('../../lib/translator/filter');
const Transformer = require('../../lib/translator/transformer');

const fs = require('fs');
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

describe('Filter', () => {
    let filtered, expected;

    beforeEach(done => {
        fs.readFile('./spec/fixtures/lang.json', 'utf8' , (err, data) => {
            if (err) {
                console.error(err);
                throw err;
            }

            const translations = Transformer.transform(JSON.parse(data), 'en', 'en');
            filtered = Filter.filterByKey(translations, 'header');
            expected = {
                locale: 'en',
                locales: {
                    'header.welcome_back': 'en',
                    'header.skip_to_main': 'en'
                },
                translations: {
                    'header.welcome_back': 'Welcome back, {name}',
                    'header.skip_to_main': 'Skip to main content'
                }
            };
            done();
        });
    });

    it('should return locale unchanged', done => {
        expect(filtered['locale']).to.equal(expected['locale']);
        done();
    });

    it('should return filtered locales', done => {
        expect(filtered['locales']).to.equal(expected['locales']);
        done();
    });

    it('should return filtered translations', done => {
        expect(filtered['translations']).to.equal(expected['translations']);
        done();
    });
});
