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

describe('occurrences helper', function() {
    const context = {
        string: "asdf asdf2 xxx yyy",
        number: 1,
        object: {
            asdf: 1,
            asdf2: 2,
            xxx: 3,
            yyy: 4,
        },
        array: ['asdf', 'asdf2', 'xxx', 'yyy']
    };

    it('should count number of occurrences of substring', function(done) {
        expect(c("{{occurrences string 'asdf'}}", context)).to.contain('2');
        expect(c("{{occurrences string 'xxx'}}", context)).to.contain('1');
        expect(c("{{occurrences string 'x'}}", context)).to.contain('3');
        expect(c("{{occurrences string 'zzz'}}", context)).to.contain('0');
        done();
    });

    it('should ignore non-strings', function(done) {
        expect(c("{{occurrences object 'asdf'}}", context)).to.contain('0');
        expect(c("{{occurrences array 'asdf'}}", context)).to.contain('0');
        expect(c("{{occurrences number '1'}}", context)).to.contain('0');
        expect(c("{{occurrences string object}}", context)).to.contain('0');
        expect(c("{{occurrences string array}}", context)).to.contain('0');
        expect(c("{{occurrences '1' number}}", context)).to.contain('0');
        done();
    });

    it('should ignore empty strings', function(done) {
        expect(c("{{occurrences '' 'asdf'}}", context)).to.contain('0');
        expect(c("{{occurrences string ''}}", context)).to.contain('0');
        done();
    });
});
