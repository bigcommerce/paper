var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

describe('loadTheme()', function() {
    var assembler = {
        getTemplates: (path, processor, callback) => {
            process.nextTick(() => {
                callback(null, processor({
                    'pages/product': '<html></html>',
                    'pages/partial': '<p></p>',
                    'pages/localeName': '{{locale_name}}',
                }));
            });
        },
        getTranslations: callback => {
            process.nextTick(() => {
                callback(null, {
                    'en': {
                        hello: 'Hello {name}',
                        level1: {
                            level2: 'we are in the second level'
                        }
                    },
                    'fr': {
                        hello: 'Bonjour {name}',
                        level1: {
                            level2: 'nous sommes dans le deuxième niveau'
                        }
                    },
                    'fr-CA': {
                        hello: 'Salut {name}'
                    }
                });
            });
        }
    };

    it('should use the assembler interface to load templates and translations', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/product', 'fr-CA;q=0.8, fr, en', () => {
            expect(paper.renderer.isTemplateLoaded('pages/product')).to.be.true();
            expect(paper.renderer.isTemplateLoaded('pages/partial')).to.be.true();
            expect(paper.renderer.getTranslator().translate('hello', {name: 'Mario'})).to.be.equal('Bonjour Mario');
            expect(paper.renderer.getTranslator().translate('hello', {name: 'Already Compiled'})).to.be.equal('Bonjour Already Compiled');
            expect(paper.renderer.getTranslator().translate('does_not_exist')).to.be.equal('does_not_exist');

            done();
        });
    });

    it('should get the localeName from the acceptLanguage header', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/localeName', 'fr-CA;q=0.8, fr, en', () => {
            expect(paper.renderer.getTranslator().getLocale()).to.be.equal('fr');

            done();
        });
    });

    it('should default to english if the locale is not supported', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/localeName', 'es-VE, en', () => {
            expect(paper.renderer.getTranslator().getLocale()).to.be.equal('en');

            done();
        });
    });

    it('should include the langName in the template context', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/localeName', 'fr-CA, en', () => {
            expect(paper.render('pages/localeName', {})).to.be.equal('fr-CA');

            done();
        });
    });
});

describe('render()', function() {
    const assembler = {
        getTemplates: (path, processor, callback) => {
            process.nextTick(() => {
                callback(null, processor({
                    'pages/product': '<html>{{> pages/partial}}</html>',
                    'pages/partial': '<p>{{variable}}</p>',
                    'pages/greet': '<h1>{{lang \'good\'}} {{lang \'morning\'}}</h1>',
                    'pages/pre': '{{{pre object}}}',
                }));
            });
        },
        getTranslations: callback => {
            process.nextTick(() => {
                callback(null, {});
            });
        }
    };

    const context = {
        variable: 'hello world',
        object: {}
    };

    it('should render pages/product', function(done) {
        const paper = new Paper(null, null, assembler);
        paper.loadTheme('pages/product', '', () => {
            expect(paper.render('pages/product', context)).to.be.equal('<html><p>hello world</p></html>');
            done();
        });
    });

    it('should render pages/partial', function(done) {
        const paper = new Paper(null, null, assembler);
        paper.loadTheme('pages/product', '', () => {
            expect(paper.render('pages/partial', context)).to.be.equal('<p>hello world</p>');
            done();
        });
    });
});
