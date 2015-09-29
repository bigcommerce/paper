var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(templates, context) {
    return new Paper().loadTemplatesSync(templates).render('template', context);
}

describe('partial and block helpers', function() {

    it('should itarate 10 times', function(done) {
        var templates = {
            template: '{{#partial "page"}}<h1>{{title}}</h1><p>{{content}}</p>{{/partial}}{{> layout}}',
            layout: '<html><body>{{#block "page"}}{{/block}}</body>/<html>',
        },
        context = {
            title: 'Hello',
            content: 'World',
        };

        expect(c(templates, context))
            .to.contain('<html><body><h1>Hello</h1><p>World</p></body>/<html>');

        done();
    });
});
