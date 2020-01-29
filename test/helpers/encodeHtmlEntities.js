var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    var themeSettings = {};
    return new Paper({}, themeSettings).loadTemplatesSync({template: template}).render('template', context);
}

describe('encodeHtmlEntities helper', function() {
    const context = {
        string: 'foo © bar ≠ baz 𝌆 qux',
        quotes: '"some" \'quotes\'',
    };

    it('should return a string with HTML entities encoded', function(done) {
        expect(c('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux"}}', context))
            .to.be.equal(`foo &#xA9; bar &#x2260; baz &#x1D306; qux`);
        expect(c('{{encodeHtmlEntities string}}', context))
            .to.be.equal(`foo &#xA9; bar &#x2260; baz &#x1D306; qux`);
        expect(c('{{encodeHtmlEntities "string"}}', context))
            .to.be.equal(`string`);
        expect(c('{{encodeHtmlEntities quotes}}', context))
            .to.be.equal('&#x22;some&#x22; &#x27;quotes&#x27;');
        expect(c('{{encodeHtmlEntities "an ampersand: &"}}', context))
            .to.be.equal('an ampersand: &#x26;');
        done();
    });
});
