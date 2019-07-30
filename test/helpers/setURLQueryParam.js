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

describe('setURLQueryParam helper', function() {
    const context = {
        image_url: 'http://example.com/image.png',
        not_a_url: null,
        key: 'referrer',
        value: 'google',
    };

    it('should return a URL with an added parameter given correct input', function(done) {
        expect(c('{{setURLQueryParam "http://example.com/image.jpg" key value}}', context))
            .to.be.equal(`http://example.com/image.jpg?${context.key}=${context.value}`);
        expect(c('{{setURLQueryParam image_url "key" "value"}}', context))
            .to.be.equal(`${context.image_url}?key=value`);
        expect(c('{{setURLQueryParam (setURLQueryParam image_url "key" "value") "key2" "value2"}}', context))
            .to.be.equal(`${context.image_url}?key=value&key2=value2`);
        expect(c('{{setURLQueryParam "http://example.com/product-1?sku=abc123" "key" "value"}}', context))
            .to.be.equal('http://example.com/product-1?sku=abc123&key=value');
        done();
    });

    it('should return a URL with an updated parameter given correct input', function(done) {
        expect(c('{{setURLQueryParam "http://example.com/image.jpg?c=2" "c" "3"}}', context))
            .to.be.equal('http://example.com/image.jpg?c=3');
        expect(c('{{setURLQueryParam "http://example.com/image.jpg?a=1&c=2" "c" "3"}}', context))
            .to.be.equal('http://example.com/image.jpg?a=1&c=3');
        expect(c('{{setURLQueryParam (setURLQueryParam "http://example.com/image.jpg?a=1&c=2" "a" "2") "c" "3"}}', context))
            .to.be.equal('http://example.com/image.jpg?a=2&c=3');
        expect(c('{{setURLQueryParam "http://example.com/product-1?sku=abc123" "sku" "def456"}}', context))
            .to.be.equal('http://example.com/product-1?sku=def456');
        done();
    });

    it('should throw an exception if a url is passed with no parameters', function (done) {
        try {
            c('{{setURLQueryParam "http://example.com/image.jpg"}}');
        } catch(e) {
        }
        try {
            c('{{setURLQueryParam urlData}}');
        } catch(e) {
        }
        done();
    });

    it('should throw an exception if a url is passed with only one parameter', function (done) {
        try {
            c('{{setURLQueryParam "http://example.com/image.jpg" "key"}}');
        } catch(e) {
        }
        try {
            c('{{setURLQueryParam urlData key}}');
        } catch(e) {
        }
        done();
    });

    it('should throw an exception if an invalid URL is passed', function (done) {
        try {
            c('{{setURLQueryParam not_a_url key value}}');
        } catch(e) {
        }
        try {
            c('{{setURLQueryParam not_a_url "key" "value"}}');
        } catch(e) {
        }
        try {
            c('{{setURLQueryParam "not_a_url" "key" "value"}}');
        } catch(e) {
        }
        try {
            c('{{setURLQueryParam "not_a_url" key value}}');
        } catch(e) {
        }
        done();
    });
});
