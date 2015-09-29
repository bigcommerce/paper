var Code = require('code'),
    Lab = require('lab'),
    Handlebars = require('Handlebars'),
    Paper = require('../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;


describe('compile()', function() {
    var templates = {
            'pages/product': '<html>{{> pages/partial}}</html>',
            'pages/partial': '<p>{{variable}}</p>',
            'pages/greet': '<h1>{{lang \'good\'}} {{lang \'morning\'}}</h1>',
            'pages/pre': '{{{pre object}}}',
        },
        context = {
            variable: 'hello world',
            object: {}
        };

    it('should compile pages/product', function(done) {
        var compiled = new Paper().loadTemplatesSync(templates).render('pages/product', context);
        expect(compiled).to.be.equal('<html><p>hello world</p></html>');
        done();
    });

    it('should compile pages/partial', function(done) {
        var compiled = new Paper().loadTemplatesSync(templates).render('pages/partial', context);
        expect(compiled).to.be.equal('<p>hello world</p>');
        done();
    });

    it('should compile with errors', function(done) {
        var templates = {
            'errorPage': '{{'
        };

        try {
            var compiled = new Paper().loadTemplatesSync(templates).render('errorPage', context);
            expect(compiled).not.to.exist();
        } catch (ex) {
            expect(ex).to.exist();
        }

        done();
    });
});
