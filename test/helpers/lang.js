var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    var theme = new Paper().loadTemplatesSync({template: template})

    theme.translate = function (key, params) {
        return 'Powered By ' + params.name;
    };

    return theme.render('template', context);
}

describe('lang helper', function() {
    var context = {
        name: 'BigCommerce'
    };

    it('should translate the key with attributes', function(done) {

        expect(c('{{lang "powered_by" name=name}}', context))
            .to.be.equal('Powered By BigCommerce');

        done();
    });
});
