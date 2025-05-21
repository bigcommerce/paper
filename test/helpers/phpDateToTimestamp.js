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

describe('phpDateToTimestamp helper', function() {

    var context = {
        st: 'Mar 1st 2017',
        nd: 'Mar 2nd 2017', 
        rd: 'Mar 3rd 2017',
        th: 'Mar 4th 2017'
    };

    it('should return the unix timestamp for Mar 1st 2017 GMT', function(done) {

        expect(c('{{phpDateToTimestamp st}}', context))
            .to.be.equal('1488326400000');
        done();
    });

    it('should return the unix timestamp for Mar 2nd 2017 GMT', function(done) {

        expect(c('{{phpDateToTimestamp nd}}', context))
            .to.be.equal('1488412800000');
        done();
    });

    it('should return the unix timestamp for Mar 3rd 2017 GMT', function(done) {

        expect(c('{{phpDateToTimestamp rd}}', context))
            .to.be.equal('1488499200000');
        done();
    });

    it('should return the unix timestamp for Mar 4th 2017 GMT', function(done) {

        expect(c('{{phpDateToTimestamp th}}', context))
            .to.be.equal('1488585600000');
        done();
    });

});
