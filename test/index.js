var Code = require('code'),
    Lab = require('lab'),
    Handlebars = require('Handlebars'),
    Paper = require('../lib'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    sourceMock = {
        'pages/product': '<html>{{> pages/partial }}</html>',
        'pages/partial': '{{ variable }}'
    },
    data = {
        'variable': 'hello world'
    };

describe('compile()', function() {
    it('should compile pages/product without errors', function(done) {
        Paper.compile('pages/product', sourceMock, data, function(err, compiled) {
            expect(compiled).to.be.equal('<html>hello world</html>');
            done();
        });
    });

    it('should compile pages/partial without errors', function(done) {
        Paper.compile('pages/partial', sourceMock, data, function(err, compiled) {
            expect(compiled).to.be.equal('hello world');
            done();
        });
    });

    it('should compile with errors', function(done) {
        var sourceErrorMock = {
                'errorPage': '{{'
            },
            data = {};

        Paper.compile('errorPage', sourceErrorMock, data, function(err, compiled) {
            expect(err).to.not.be.null();
            expect(compiled).to.not.exist();
            done();
        });
    });
});

describe('compileSync()', function() {
    it('should compile pages/product without errors', function(done) {
        var compiled = Paper.compileSync('pages/product', sourceMock, data);
        expect(compiled).to.be.equal('<html>hello world</html>');
        done();
    });

    it('should compile pages/partial without errors', function(done) {
        var compiled = Paper.compileSync('pages/partial', sourceMock, data);
        expect(compiled).to.be.equal('hello world');
        done();
    });

    it('should compile with errors', function(done) {
        var sourceErrorMock = {
                'errorPage': '{{'
            },
            data = {},
            compiled;

        try {
            compiled = Paper.compileSync('errorPage', sourceErrorMock, data);
            expect(compiled).not.to.exist();
        } catch (ex) {
            expect(ex).to.exist();
        }

        done();
    });
});

describe('compileTranslations()', function() {
    var mockTranslations = {
        'en': JSON.stringify({
            'this': {
                'is': {
                    'a_nested': 'english',
                    'a_dynamic': 'A very {adj} string'
                }
            },
            'hello': 'world',
            'complex': "{GENDER, select, male {He} female {She} other {They}} found {NUM_RESULTS, plural, one {1 result} other {# results} } in {NUM_CATEGORIES, plural, one {1 category} other {# categories}}.",
            'cats': 'I just wanted to {verb}... {cat_count, plural, =0{There are no cats} one {There is one cat} other {There are # cats}}'
        }),
        'en-CA': JSON.stringify({
            'this': {
                'is': {
                    'a_nested': 'canadian'
                }
            }
        }),
        'fr': JSON.stringify({
            'test': 'tester',
            'cats': 'Je juste veux {verb}... {cat_count, plural, =0{Il n\'y a pas de chat} one {Il y a un chat} other {Il y a # chats}}'
        }),
        'fr-CA': JSON.stringify({
            'hello': 'Bonjour',
            'cats': 'Cats in Canada'
        }),
        'fr-CA-QB': JSON.stringify({'hello': 'Bonjour from Quebec'})
    },
    rootLocale = 'en';





    it('should compile valid translations without errors', function(done) {
        var compiled = Paper.compileTranslations(rootLocale, mockTranslations);
        expect(compiled).to.contain('en');
        expect(compiled).to.contain('en-CA');
        expect(compiled).to.contain('fr');
        expect(compiled).to.contain('fr-CA');
        expect(compiled).to.contain('fr-CA-QB');

        expect(compiled['en']).to.contain('this.is.a_nested');
        expect(compiled['en']['this.is.a_nested']()).to.equal('english');
        expect(compiled['en']['cats']({cat_count: 0, verb: 'say'})).to.equal('I just wanted to say... There are no cats');
        expect(compiled['en']['cats']({cat_count: 1, verb: 'shout'})).to.equal('I just wanted to shout... There is one cat');
        expect(compiled['en']['cats']({cat_count: 2, verb: 'scream'})).to.equal('I just wanted to scream... There are 2 cats');
        expect(compiled['en']['complex']({GENDER: 'male', NUM_RESULTS: 3, NUM_CATEGORIES: 2})).to.equal('He found 3 results in 2 categories.');
        expect(compiled['en']['complex']({GENDER: 'unknown', NUM_RESULTS: 1, NUM_CATEGORIES: 1})).to.equal('They found 1 result in 1 category.');

        expect(compiled['en-CA']).to.contain('this.is.a_nested');
        expect(compiled['en-CA']['this.is.a_nested']()).to.equal('canadian');
        expect(compiled['fr']['hello']()).to.equal('world');

        expect(compiled['fr']).to.contain('this.is.a_nested');
        expect(compiled['fr']['test']()).to.equal('tester');
        expect(compiled['fr']['this.is.a_nested']()).to.equal('english');
        expect(compiled['fr']['cats']({cat_count: 0, verb: 'dire'})).to.equal('Je juste veux dire... Il n\'y a pas de chat');
        expect(compiled['fr']['cats']({cat_count: 1, verb: 'dire'})).to.equal('Je juste veux dire... Il y a un chat');
        expect(compiled['fr']['cats']({cat_count: 2, verb: 'dire'})).to.equal('Je juste veux dire... Il y a 2 chats');

        expect(compiled['fr-CA']).to.contain('this.is.a_nested');
        expect(compiled['fr-CA']['test']()).to.equal('tester');
        expect(compiled['fr-CA']['hello']()).to.equal('Bonjour');
        expect(compiled['fr-CA']['this.is.a_nested']()).to.equal('english');
        expect(compiled['fr-CA']['cats']({cat_count: 2, verb: 'dire'})).to.equal('Cats in Canada');

        expect(compiled['fr-CA-QB']).to.contain('this.is.a_nested');

        expect(compiled['fr-CA-QB']['hello']()).to.equal('Bonjour from Quebec');
        expect(compiled['fr-CA-QB']['test']()).to.equal('tester');
        expect(compiled['fr-CA-QB']['this.is.a_nested']()).to.equal('english');
        done();
    });
});

