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

describe('replace helper', function() {
    var templates = {
        template: "{{#replace '%%var%%' content}}{{> template2}}{{/replace}}",
        template2: "day"
    },
    context = {
        content: "Either you run the %%var%% or the  %%var%% runs you",

    };

    it('should replace all ocurrance of %%var%% with "day"', function(done) {

        expect(c(templates, context))
            .to.be.equal('Either you run the day or the  day runs you');

        done();
    });

});
