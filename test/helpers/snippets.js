var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(snippets, template, context) {
    var paper = new Paper();
    paper.snippets = snippets;
    return paper.loadTemplatesSync({template: template}).render('template', context);
}

describe('snippet helper', function() {
    var context = {
        product: {
            id: '111'
        }
    };

    it('should render in the correct location', function(done) {
        var snippets = {
            "footer": [
                {
                    "name": "app1",
                    "snippets": [
                        '<div>footer</div>',
                    ]
                }
            ],
            "header": [
                {
                    "name": "app2",
                    "snippets": [
                        '<div>header</div>',
                    ]
                }
            ]
        };

        var template = "{{{snippet 'header'}}}<div>content</div>{{{snippet 'footer'}}}";

        expect(c(snippets, template, context))
            .to.be.equal('<div>header</div><div>content</div><div>footer</div>');

        done();
    });

    it('should render the snippet context with the template context', function(done) {
        var snippets = {
            "footer": [
                {
                    "name": "app1",
                    "context": {
                        "key": "12345"
                    },
                    "snippets": [
                        '<div data-key="{{app.key}}" data-product-id="{{product.id}}"></div>',
                    ]
                }
            ]
        };

        var template = "{{{snippet 'footer'}}}";

        expect(c(snippets, template, context))
            .to.be.equal('<div data-key="12345" data-product-id="111"></div>');

        done();
    });


    it('should combine all snippets if the object has more than one snippet', function(done) {
        var snippets = {
            "reviews": [
                {
                    "name": "app1",
                    "context": {},
                    "snippets": [
                        '<div id="a"></div>',
                        '<div id="b"></div>',
                        '<div id="c"></div>'
                    ]
                }
            ]
        };

        var template = "{{{snippet 'reviews'}}}";

        expect(c(snippets, template, context))
            .to.be.equal('<div id="a"></div>\n<div id="b"></div>\n<div id="c"></div>');

        done();
    });

    it('each snippet should have its own context', function(done) {
        var snippets = {
            "location1": [
                {
                    "name": "app1",
                    "context": {id: 123},
                    "snippets": [
                        '<div id="{{app.id}}"></div>',
                    ]
                },
                {
                    "name": "app2",
                    "context": {id: 789},
                    "snippets": [
                        '<div id="{{app.id}}"></div>',
                    ]
                },
                {
                    "name": "app2",
                    "snippets": [
                        '<div id="{{app.id}}"></div>',
                    ]
                }
            ]
        };

        var template = "{{{snippet 'location1'}}}";

        expect(c(snippets, template, context))
            .to.be.equal('<div id="123"></div>\n<div id="789"></div>\n<div id=""></div>');

        done();
    });
});
