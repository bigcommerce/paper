'use strict';

const Code = require('code');
const Lab = require('lab');
const isMatch = require('../../../lib/utils/isMatch');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

describe('isMatch', () => {
    const testCases = [
        {
            testName: 'should return true when source contains pattern and they are simple one-level objects',
            source: { a: 1, b: 2, c: 'c' },
            pattern: { b: 2 },
            expectedResult: true,
        },
        {
            testName: 'should return false when source contains a pattern key but their values are different',
            source: { a: 1, b: 2, c: 'c' },
            pattern: { b: 1 },
            expectedResult: false,
        },
        {
            testName: 'should return false when source contains a pattern key but their values are of different types',
            source: { a: 1, b: 2, c: 'c' },
            pattern: { a: '1' },
            expectedResult: false,
        },
        {
            testName: 'should return false when source and pattern match only partially',
            source: { a: 1, b: 2, c: 'c' },
            pattern: { b: 2, a: 3 },
            expectedResult: false,
        },
        {
            testName: 'should return true when source contains pattern and they contain nested properties',
            source: {
                a: {
                    b: null,
                    c: 1,
                    d: {
                        f: 2,
                        g: null,
                        h: false,
                    }
                },
                k: "2",
                l: 'c'
            },
            pattern: {
                a: {
                    b: null,
                    d: {
                        f: 2,
                        h: false,
                    }
                },
                k: "2",
            },
            expectedResult: true,
        },
        {
            testName: 'should return false when source contains pattern only partially in the nested properties',
            source: {
                a: {
                    b: 'b1',
                    c: 1,
                    d: {
                        f: 2,
                        g: null,
                        h: false,
                    }
                },
                k: 2,
                l: 'c'
            },
            pattern: {
                a: {
                    b: 'b1',
                    d: {
                        f: 2,
                        h: true,
                    }
                },
            },
            expectedResult: false,
        },
        {
            testName: 'should return true when source contains pattern and they contain arrays',
            source: {
                a: {
                    b: [1, '2', false, null, [3]],
                    c: 1,
                },
                k: 2,
                l: 'c'
            },
            pattern: {
                a: {
                    b: [1, '2', false, null, [3]],
                },
                k: 2,
            },
            expectedResult: true,
        },
        {
            testName: 'should return true when source contains pattern and they contain empty objects and arrays',
            source: {
                a: {
                    b: [],
                    c: {},
                    d: 2
                },
                k: 2,
                l: 'c'
            },
            pattern: {
                a: {
                    b: [],
                    c: {},
                },
                k: 2,
            },
            expectedResult: true,
        },
        {
            testName: 'should return false when source contains pattern on a different level of nesting',
            source: {
                a: {
                    b: { c: 1, d: 'd' },
                    f: {},
                    s: 2
                },
                k: null,
                l: 'c'
            },
            pattern: { c: 1, d: 'd' },
            expectedResult: false,
        },
    ];

    for (const { testName, source, pattern, expectedResult } of testCases) {
        it(testName, async () => {
            const actualResult = isMatch(source, pattern);
            expect(actualResult).to.be.equal(expectedResult);
        });
    }
});
