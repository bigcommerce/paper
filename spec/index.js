const Code = require('code'),
      Lab = require('lab'),
      Paper = require('../index'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      expect = Code.expect,
      it = lab.it;

describe('loadTheme()', function() {
    const assembler = {
        getTemplates: (path, processor) => {
            return Promise.resolve(processor({
                'pages/product': '<html></html>',
                'pages/partial': '<p></p>',
                'pages/localeName': '{{locale_name}}',
            }));
        },
        getTranslations: () => {
            return Promise.resolve({
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
        }
    };

    it('should use the assembler interface to load templates and translations', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/product', 'fr-CA;q=0.8, fr, en').then(() => {
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

        paper.loadTheme('pages/localeName', 'fr-CA;q=0.8, fr, en').then(() => {
            expect(paper.renderer.getTranslator().getLocale()).to.be.equal('fr');

            done();
        });
    });

    it('should default to english if the locale is not supported', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/localeName', 'es-VE, en').then(() => {
            expect(paper.renderer.getTranslator().getLocale()).to.be.equal('en');

            done();
        });
    });

    it('should include the langName in the template context', done => {
        const paper = new Paper(null, null, assembler);

        paper.loadTheme('pages/localeName', 'fr-CA, en').then(() => {
            paper.render('pages/localeName', {}).then(result => {
                expect(result).to.be.equal('fr-CA');
                done();
            });
        });
    });
});

describe('render()', function() {
    const assembler = {
        getTemplates: (path, processor) => {
            return Promise.resolve(processor({
                'pages/product': '<html>{{> pages/partial}}</html>',
                'pages/partial': '<p>{{variable}}</p>',
                'pages/greet': '<h1>{{lang \'good\'}} {{lang \'morning\'}}</h1>',
                'pages/pre': '{{{pre object}}}',
                'pages/hints': '{{{ earlyHint themeCss "preload" }}}'
            }));
        },
        getTranslations: () => {
            return Promise.resolve({});
        }
    };

    const context = {
        variable: 'hello world',
        object: {},
        themeCss: '/my/asset/style.css'
    };

    it('should render pages/product', function(done) {
        const paper = new Paper(null, null, assembler);
        paper.loadTheme('pages/product', '').then(() => {
            paper.render('pages/product', context).then(result => {
                expect(result).to.be.equal('<html><p>hello world</p></html>');
                done();
            });
        });
    });

    it('should render pages/partial', function(done) {
        const paper = new Paper(null, null, assembler);
        paper.loadTheme('pages/product', '').then(() => {
            paper.render('pages/partial', context).then(result => {
                expect(result).to.be.equal('<p>hello world</p>');
                done();
            });
        });
    });

    it('should render pages/hints and find resource hints', done => {
        const paper = new Paper(null, null, assembler);
        paper.loadTheme('pages/product', '')
            .then(() => paper.render('pages/hints', context))
            .then(result => {
                expect(result).to.equals(context.themeCss);
                let hints = paper.getResourceHints();
                expect(hints).to.have.length(1);
                expect(hints[0]).to.equals({src: context.themeCss, state: 'preload', cors: 'no'});
                done();
            });
    });
});

describe('renderTheme()', function() {
    const assembler = {
        getTemplates: (path, processor) => {
            return Promise.resolve(processor({
                'pages/product': '<html>{{> pages/partial}}</html>',
                'pages/partial': '<h1>Hello world</h1>',
                'pages/greet': '<h2>{{lang \'good\'}} {{lang \'morning\'}}</h2>',
                'pages/pre': '<p>Let it go!</p>',
            }));
        },
        getTranslations: () => {
            return Promise.resolve({});
        }
    };

    const themeComponents = ['pages/product', 'pages/partial', 'pages/greet', 'pages/pre'];

    it('should render theme', function(done) {
        const paper = new Paper(null, null, assembler);
        paper.loadTheme(themeComponents, '').then(() => {
            paper.renderTheme(themeComponents, {}).then(result => {
                expect(result).to.be.equal({
                    'pages/product': '<html><h1>Hello world</h1></html>',
                    'pages/partial': '<h1>Hello world</h1>',
                    'pages/greet': '<h2>good morning</h2>',
                    'pages/pre': '<p>Let it go!</p>' }
                );
                done();
            });
        });
    });
});


describe('loadTranslations', () => {
    it('should load translations in normal flow (transforming and flattening translations)', done => {
        const assembler = {
            getTemplates: () => Promise.resolve({}),
            getTranslations: () => {
                return Promise.resolve({
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
            }
        };
        const paper = new Paper(null, null, assembler);
        paper.loadTranslations('en').then(() => {
            expect(paper.renderer.getTranslator().getLanguage().locales).to.equal({ hello: 'en', 'level1.level2': 'en' });
            done();
        });
    });
});

describe('Request Params', function() {
    it('should set and retrieve request params ', done => {
        const params = { security: { nonce: '1234' } };
        const paper = new Paper(null, null, null, 'v4', console, 'error', params);
        expect(paper.getRequestParams()).to.equal(params);

        const newParams = { security: { nonce: '5678' } };
        paper.setRequestParams(newParams);
        expect(paper.getRequestParams()).to.equal(newParams);
        done();
    });
});