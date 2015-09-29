var Code = require('code'),
    Lab = require('lab'),
    Handlebars = require('Handlebars'),
    Paper = require('../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

describe('loadTheme()', function() {
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

    it('should use the assembler interface to load templates and translations', function(done) {
        var assembler = {
            getTemplates: function(path, processor, callback) {
                process.nextTick(function() {
                    var templates = {
                        'pages/product': '<html></html>',
                        'pages/partial': '<p></p>',
                    };

                    callback(null, processor(templates));
                });
            },
            getTranslations: function (callback) {
                process.nextTick(function() {
                    var translations = {
                        'en': {
                            hello: 'Hello {name}'
                        }
                    };

                    callback(null, translations);
                });
            }
        };

        var paper = new Paper(assembler);

        paper.loadTheme('pages/product', 'en', function () {

            expect(paper.handlebars.templates['pages/product']).to.be.a.function();
            expect(paper.handlebars.templates['pages/partial']).to.be.a.function();
            expect(paper.translate).to.be.a.function();
            expect(paper.translate('hello', {name: 'Mario'})).to.be.equal('Hello Mario');

            done();
        });

    });
});

describe('render()', function() {
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

    it('should render pages/product', function(done) {
        var compiled = new Paper().loadTemplatesSync(templates).render('pages/product', context);
        expect(compiled).to.be.equal('<html><p>hello world</p></html>');
        done();
    });

    it('should render pages/partial', function(done) {
        var compiled = new Paper().loadTemplatesSync(templates).render('pages/partial', context);
        expect(compiled).to.be.equal('<p>hello world</p>');
        done();
    });

    it('should render with errors', function(done) {
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
