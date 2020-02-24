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

    // Some test cases lifted from https://github.com/mathiasbynens/he

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

    it('should return a string with HTML entities encoded with named references', function(done) {
        expect(c('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" useNamedReferences="true"}}', context))
            .to.be.equal(`foo &copy; bar &ne; baz &#x1D306; qux`);
        done();
    });

    it('should return a string with HTML entities encoded with decimal option', function(done) {
        expect(c('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" decimal="true"}}', context))
            .to.be.equal(`foo &#169; bar &#8800; baz &#119558; qux`);
        done();
    });

    it('should return a string with HTML entities encoded with named references and decimal option', function(done) {
        expect(c('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" useNamedReferences="true" decimal="true"}}', context))
            .to.be.equal(`foo &copy; bar &ne; baz &#119558; qux`);
        done();
    });

    it('should return a string with HTML entities encoded with encodeEverything option', function(done) {
        expect(c('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" encodeEverything="true"}}', context))
            .to.be.equal(`&#x66;&#x6F;&#x6F;&#x20;&#xA9;&#x20;&#x62;&#x61;&#x72;&#x20;&#x2260;&#x20;&#x62;&#x61;&#x7A;&#x20;&#x1D306;&#x20;&#x71;&#x75;&#x78;`);
        done();
    });

    it('should return a string with HTML entities encoded with encodeEverything and useNamedReferences option', function(done) {
        expect(c('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" encodeEverything="true" useNamedReferences="true"}}', context))
            .to.be.equal(`&#x66;&#x6F;&#x6F;&#x20;&copy;&#x20;&#x62;&#x61;&#x72;&#x20;&ne;&#x20;&#x62;&#x61;&#x7A;&#x20;&#x1D306;&#x20;&#x71;&#x75;&#x78;`);
        done();
    });

    it('should return a string with HTML entities encoded with allowUnsafeSymbols option', function(done) {
        expect(c('{{encodeHtmlEntities "foo © and & ampersand" allowUnsafeSymbols="true"}}', context))
            .to.be.equal(`foo &#xA9; and & ampersand`);
        done();
    });

    it('should throw an exception if an invalid named argument is passed', function (done) {
        try {
            c('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" useNamedReferences="blah"}}');
        } catch(e) {
        }
        try {
            c('{{encodeHtmlEntities "foo © bar ≠ baz 𝌆 qux" blah="true"}}');
        } catch(e) {
        }
        done();
    });

    it('should throw an exception if a non-string argument is passed', function (done) {
        try {
            c('{{encodeHtmlEntities 123}}');
        } catch(e) {
        }
        done();
    });
});
