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

describe('inject helper', function() {
    const context = {
        value1: "Big",
        value2: "Commerce",
        badChars: "&<>\"'`",
        jsonString: JSON.stringify({"big": "commerce"}),
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

    it('should escape strings', function(done) {
        var template = "{{inject 'filtered' badChars}}{{jsContext}}";

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

    it('should escape strings nested in objects and arrays', function(done) {
        var template = "{{inject 'filtered' nested}}{{jsContext}}";

        expect(c(template, context))
            .to.be.equal('"{\\"filtered\\":{\\"firstName\\":\\"&amp;&lt;&gt;\\",\\"lastName\\":\\"&quot;&#x27;&#x60;\\",\\"addresses\\":[{\\"street\\":\\"123 &amp;&lt;&gt;&quot;&#x27;&#x60; St\\"}]}}"');
        
        done()
    });
});
