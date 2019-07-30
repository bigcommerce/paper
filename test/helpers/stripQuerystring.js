var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    var themeSettings = {
        logo_image: '600x300',
    };
    return new Paper({}, themeSettings).loadTemplatesSync({template: template}).render('template', context);
}

describe('stripQuerystring helper', function() {
    const urlData_2_qs = 'https://cdn.example.com/path/to/{:size}/image.png?c=2&imbypass=on';
    const context = {
        image_with_2_qs: {
            data: urlData_2_qs
        },
    };

    it('strips the query string from a given url', function(done) {
        expect(c('{{stripQuerystring "http://www.example.com?foo=1&bar=2&baz=3"}}', context))
            .to.be.equal('http://www.example.com');

        done();
    });

    it('should work with the getImageSrcset helper as a nested expression', function(done) {
        expect(c('{{stripQuerystring (getImageSrcset image_with_2_qs 1x="100x100")}}', context))
            .to.be.equal('https://cdn.example.com/path/to/100x100/image.png');

        done();
    });

    it('should work with the getImage helper as a nested expression', function(done) {
        expect(c('{{stripQuerystring (getImage image_with_2_qs "logo_image")}}', context))
            .to.be.equal('https://cdn.example.com/path/to/600x300/image.png');

        done();
    });
});
