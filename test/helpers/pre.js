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

describe('pre helper', function() {

    it('should render an object properly', function(done) {

        expect(c('{{{pre var}}}', {var: {}}))
            .to.be.equal('<pre>{}</pre>');

        done();
    });

    it('should scape html entities', function(done) {

        expect(c('{{{pre var}}}', {var: "<div>&\"500\"</div>"}))
            .to.be.equal('<pre>&#34;&lt;div&gt;&amp;\\&#34;500\\&#34;&lt;/div&gt;&#34;</pre>');

        done();
    });
});
