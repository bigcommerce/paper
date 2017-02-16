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

describe('truncate helper', function() {

    var context = {
        string: 'hello world',
        number: 2
    };

    it('should return the entire string if length is longer than the input string', function(done) {

        expect(c('{{truncate string 15}}', context))
            .to.be.equal('hello world');
        done();
    });

    it('should return the first length number of characters', function(done) {

        expect(c('{{truncate string 5}}', context))
            .to.be.equal('hello');
        done();
    });

    it('should return the first argument, coerced to a string, if it is not a string', function(done) {

        expect(c('{{truncate number 5}}', context))
            .to.be.equal('2');
        done();
    });
});
