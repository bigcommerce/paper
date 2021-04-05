var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    return new Paper().loadTemplatesSync({ template: template }).render('template', context);
}

describe('inject helper', function() {
    const context = {
        value1: "Big",
        value2: "Commerce",
        badChars: "&<>\"'`",
        jsonString: JSON.stringify({ "big": "commerce" }),
        nested: {
            firstName: "&<>",
            lastName: "\"'`",
            addresses: [
                {
                    street: "123 &<>\"'` St"
                }
            ],
        },
    };

    it('should inject variables', function(done) {
        var template = "{{inject 'data1' value1}}{{inject 'data2' value2}}{{jsContext}}";

        expect(c(template, context))
            .to.be.equal('"{\\"data1\\":\\"Big\\",\\"data2\\":\\"Commerce\\"}"');

        done();
    });

    it('should escape strings when escape is set to true', function(done) {
        var template = "{{inject 'filtered' badChars true}}{{jsContext}}";

        expect(c(template, context))
            .to.be.equal('"{\\"filtered\\":\\"&amp;&lt;&gt;&quot;&#x27;&#x60;\\"}"');

        done();
    });

    it('should exclude JSON strings from filtering', function(done) {
        var template = "{{inject 'filtered' jsonString}}{{jsContext}}";

        expect(c(template, context))
            .to.be.equal('"{\\"filtered\\":\\"{\\\\\\"big\\\\\\":\\\\\\"commerce\\\\\\"}\\"}"');

        done();
    });

    it('should escape strings nested in objects and arrays when escape is set to true', function(done) {
        var template = "{{inject 'filtered' nested true}}{{jsContext}}";

        expect(c(template, context))
            .to.be.equal('"{\\"filtered\\":{\\"firstName\\":\\"&amp;&lt;&gt;\\",\\"lastName\\":\\"&quot;&#x27;&#x60;\\",\\"addresses\\":[{\\"street\\":\\"123 &amp;&lt;&gt;&quot;&#x27;&#x60; St\\"}]}}"');

        done()
    });

    it('should not escape characters by default', function(done) {
        var template = "{{inject 'unfiltered' nested.firstName}}{{jsContext}}";

        expect(c(template, context))
            .to.be.equal('"{\\"unfiltered\\":\\"&<>\\"}"');

        done();
    })

    it('should not escape characters when escape is set to false', function(done) {
        var template = "{{inject 'unfiltered' nested.firstName false}}{{jsContext}}";

        expect(c(template, context))
            .to.be.equal('"{\\"unfiltered\\":\\"&<>\\"}"');

        done();
    })
});
