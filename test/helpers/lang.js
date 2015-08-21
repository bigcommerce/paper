var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context, translations) {
    return Paper.compile('template', {template: template}, context, translations);
}

describe('lang helper', function() {
    var context = {
            company: 'BigCommerce'
        },
        translations = {
            title: function () {
                return 'Titulo';
            },
            powered_by: function (obj) {
                return 'Powered by ' + obj.company;
            },
        };

    it('should translate the key', function(done) {

        expect(c('{{lang "title"}}', context, translations))
            .to.be.equal('Titulo');

        done();
    });

    it('should translate the key with attributes', function(done) {

        expect(c('{{lang "powered_by" company=company}}', context, translations))
            .to.be.equal('Powered by BigCommerce');

        done();
    });
});
