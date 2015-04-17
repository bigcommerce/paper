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
