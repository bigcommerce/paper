var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    return new Paper().loadTemplatesSync({template: template}).render('template', context);
}

describe('fonts helper', function() {
    var context = {
        theme_settings: {
            'header-test-font': 'Open+Sans_400',
            'body-font': 'Karla_700',
            'random-property': 'not a font'
        }
    };

    it('should return the expected font url', function(done) {
        var template = "{{getFontsUrl}}";

        expect(c(template, context))
            .to.be.equal('https://fonts.googleapis.com/css?family=Open+Sans:400|Karla:700|');

        done();
    });
});
