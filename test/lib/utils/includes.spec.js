'use strict';

const Code = require('code');
const Lab = require('lab');
const includes = require("../../../lib/utils/includes");

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

describe('includes', () => {
    (function() {
        const testData1 = {
            'an `arguments` object': arguments,
            'an array': [1, 2, 3, 4],
            'an object': { 'a': 1, 'b': 2, 'c': 3, 'd': 4 },
            'a string': '1234'
        };
        for (const [key, collection] of Object.entries(testData1)) {
            it(`should return "true" for matched values of ${key}`, async () => {
                expect(includes(collection, 3)).to.be.equal(true);
            });

            it(`should return "false" for unmatched values of ${key}`, async () => {
                expect(includes(collection, 5)).to.be.equal(false);
            });

            it(`should floor "fromIndex" values of ${key}`, async () => {
                expect(includes(collection, 2, 1.2)).to.be.equal(true);
            });
        }
    })(1, 2, 3, 4);

    const testData2 = {
        'literal': 'abc',
        'object': Object('abc')
    };
    Object.entries(testData2).forEach(([key, collection]) => {
        it(`should work with a string ${key} for "collection"`, async () => {
            expect(includes(collection, 'bc')).to.be.equal(true);
            expect(includes(collection, 'd')).to.be.equal(false);
        });
    });

    it('should return `false` for empty collections', async () => {
        const empties = [[], {}, null, undefined, false, 0, NaN, ''];

        for (const collection of empties) {
            const res = includes(collection, 1);

            expect(res).to.be.equal(false);
        }
    });

    describe('called on a string collection with fromIndex >= length', () => {
        const string = '1234';
        const indexes = [4, 6, Math.pow(2, 32), Infinity];

        indexes.forEach((fromIndex) => {
            it(`should return a correct result for fromIndex = ${fromIndex}`, async () => {
                expect(includes(string, 1, fromIndex)).to.be.equal(false);
                expect(includes(string, undefined, fromIndex)).to.be.equal(false);
                expect(includes(string, '', fromIndex)).to.be.equal(fromIndex === string.length);
            });
        });
    });

    it('should match -0 as 0', async () => {
        expect(includes([-0], 0)).to.be.equal(true);
        expect(includes([0], -0)).to.be.equal(true);
    });
});
