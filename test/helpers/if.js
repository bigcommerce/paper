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

describe('if helper', function() {
    var context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        string: 'yolo',
        alwaysTrue: true,
        big: 'big'
    };

    it('should have the same behavior as the original if helper', function(done) {
        expect(c('{{#if 1}}{{big}}{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if "x"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if ""}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 0}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if ""}}big{{else}}small{{/if}}', context))
            .to.be.equal('small');

        expect(c('{{#if 0}}big{{else}}small{{/if}}', context))
            .to.be.equal('small');

        expect(c('{{#if num2}}big{{else}}small{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if product}}big{{else}}small{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if string}}big{{else}}small{{/if}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render "big" if all conditions match', function(done) {

        expect(c('{{#if "1" "==" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 1 "===" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 2 "!==" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 "!=" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 ">" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num1 "<" num2}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 ">=" num1}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num1 "<=" num2}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if product "typeof" "object"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if string "typeof" "string"}}big{{/if}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render empty for all cases', function(done) {

        expect(c('{{#if "2" "==" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 2 "===" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 1 "!==" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num2 "!=" 2}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num1 ">" 20}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 4 "<" num2}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num1 ">=" 40}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num2 "<=" num1}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if product "typeof" "string"}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if string "typeof" "object"}}big{{/if}}', context))
            .to.be.equal('');

        done();
    });


    it('should render "big" if all ifs match', function(done) {

        var context = {
            num1: 1,
            num2: 2,
            product: {a: 1, b: 2},
            string: 'yolo'
        };

        expect(c('{{#if "1" num1 operator="=="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 1 num1 operator="==="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if 2 num1 operator="!=="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 num1 operator="!="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 num1 operator=">"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num1 num2 operator="<"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num2 num1 operator=">="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if num1 num2 operator="<="}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if product "object" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('big');

        expect(c('{{#if string "string" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render empty for all cases', function(done) {

        var context = {
            num1: 1,
            num2: 2,
            product: {a: 1, b: 2},
            string: 'yolo',
            emptyArray: [],
            emptyObject: {}
        };

        expect(c('{{#if emptyObject}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if emptyArray}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if emptyArray.length}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if "2" num1 operator="=="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 2 num1 operator="==="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 1 num1 operator="!=="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num2 2 operator="!="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num1 20 operator=">"}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if 4 num2 operator="<"}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num1 40 operator=">="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if num2 num1 operator="<="}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if product "string" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('');

        expect(c('{{#if string "object" operator="typeof"}}big{{/if}}', context))
            .to.be.equal('');

        done();
    });

});
