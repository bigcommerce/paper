var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../lib'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

describe('compile()', function() {
    var sourceMock = {
        'pages/product': '<html>{{> pages/partial }}</html>',
        'pages/partial': '{{ variable }}'
    }, data = {
        'variable': 'hello world'
    };

    it('should compile pages/product without errors', function(done) {
        var compiled = Paper.compile('pages/product', sourceMock, data);
        expect(compiled.template).to.be.equal('<html>hello world</html>');
        done();
    });

    it('should compile pages/partial without errors', function(done) {
        var compiled = Paper.compile('pages/partial', sourceMock, data);
        expect(compiled.template).to.be.equal('hello world');
        done();
    });

    it('should compile with errors', function(done) {
        var sourceErrorMock = {
                'errorPage': '{{'
            }, data = {

            },
            compiled;

        compiled = Paper.compile('errorPage', sourceErrorMock, data);
        expect(compiled.err).to.exist();
        done();
    });
});
