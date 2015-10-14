var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index')(),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    return Paper.make(1).loadTemplatesSync({template: template}).render('template', context);
}

describe('fonts helper', function() {
    var context = {
        theme_settings: {
            header_test_font: 'Open+Sans_400',
            body_font: 'Karla_700',
            random_property: 'not a font'
        }
    };

    it('should return the expected font url', function(done) {
        var template = "{{getFontsUrl}}";

        expect(c(template, context))
            .to.be.equal('https://fonts.googleapis.com/css?family=Open+Sans:400|Karla:700|');

        done();
    });
});
