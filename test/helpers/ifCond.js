var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    return Paper.compile('template', {template: template}, context);
}

describe('ifCond helper', function() {
    var context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        string: 'yolo'
    };

    it('should render "big" if all conditions match', function(done) {

        expect(c('{{#ifCond "1" "==" num1}}big{{/ifCond}}', context))
            .to.be.equal('big');

        expect(c('{{#ifCond 1 "===" num1}}big{{/ifCond}}', context))
            .to.be.equal('big');

        expect(c('{{#ifCond 2 "!==" num1}}big{{/ifCond}}', context))
            .to.be.equal('big');

        expect(c('{{#ifCond num2 "!=" num1}}big{{/ifCond}}', context))
            .to.be.equal('big');

        expect(c('{{#ifCond num2 ">" num1}}big{{/ifCond}}', context))
            .to.be.equal('big');

        expect(c('{{#ifCond num1 "<" num2}}big{{/ifCond}}', context))
            .to.be.equal('big');

        expect(c('{{#ifCond num2 ">=" num1}}big{{/ifCond}}', context))
            .to.be.equal('big');

        expect(c('{{#ifCond num1 "<=" num2}}big{{/ifCond}}', context))
            .to.be.equal('big');

        expect(c('{{#ifCond product "typeof" "object"}}big{{/ifCond}}', context))
            .to.be.equal('big');

        expect(c('{{#ifCond string "typeof" "string"}}big{{/ifCond}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render empty for all cases', function(done) {

        expect(c('{{#ifCond "2" "==" num1}}big{{/ifCond}}', context))
            .to.be.equal('');

        expect(c('{{#ifCond 2 "===" num1}}big{{/ifCond}}', context))
            .to.be.equal('');

        expect(c('{{#ifCond 1 "!==" num1}}big{{/ifCond}}', context))
            .to.be.equal('');

        expect(c('{{#ifCond num2 "!=" 2}}big{{/ifCond}}', context))
            .to.be.equal('');

        expect(c('{{#ifCond num1 ">" 20}}big{{/ifCond}}', context))
            .to.be.equal('');

        expect(c('{{#ifCond 4 "<" num2}}big{{/ifCond}}', context))
            .to.be.equal('');

        expect(c('{{#ifCond num1 ">=" 40}}big{{/ifCond}}', context))
            .to.be.equal('');

        expect(c('{{#ifCond num2 "<=" num1}}big{{/ifCond}}', context))
            .to.be.equal('');

        expect(c('{{#ifCond product "typeof" "string"}}big{{/ifCond}}', context))
            .to.be.equal('');

        expect(c('{{#ifCond string "typeof" "object"}}big{{/ifCond}}', context))
            .to.be.equal('');

        done();
    });

});
