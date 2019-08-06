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

describe('json helper', function() {

    const urlData_2_qs = 'https://cdn.example.com/path/to/{:size}/image.png?c=2&imbypass=on';
    const context = {
        image_with_2_qs: {
            data: urlData_2_qs
        },
        object: { a: 1, b: "hello" }
    };

    it('should render object to json format', function(done) {
        expect(c('{{{json object}}}', context))
            .to.contain('{"a":1,"b":"hello"}');

        done();
    });

    it('should work together with getImage', function(done) {
        expect(c('{{{json (getImage image_with_2_qs)}}}', context))
            .to.contain('"https://cdn.example.com/path/to/original/image.png?c=2&imbypass=on"');

        done();
    });
});
