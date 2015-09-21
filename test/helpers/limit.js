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

describe('limit helper', function() {

    it('should limit an array properly', function(done) {

        expect(c('{{#each (limit var 4)}}{{this}} {{/each}}', {var: [1,2,3,4,5,6,7,8]}))
            .to.be.equal('1 2 3 4 ');

        done();
    });
});
