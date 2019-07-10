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

describe('getImageSrcset helper', function() {
    const urlData = 'https://cdn.example.com/path/to/{:size}/image.png?c=2';
    const urlData_2_qs = 'https://cdn.example.com/path/to/{:size}/image.png?c=2&imbypass=on';
    const context = {
        image_url: 'http://example.com/image.png',
        not_an_image: null,
        image: {
            data: urlData
        },
        image_with_2_qs: {
            data: urlData_2_qs
        },
    };

    it('should return a srcset if a valid image and srcset sizes are passed', function(done) {
        expect(c('{{getImageSrcset image 100w="100w" 200w="200w" 300w="300w" 1000w="1000w"}}', context))
            .to.be.equal('https://cdn.example.com/path/to/100w/image.png?c=2 100w, https://cdn.example.com/path/to/200w/image.png?c=2 200w, https://cdn.example.com/path/to/300w/image.png?c=2 300w, https://cdn.example.com/path/to/1000w/image.png?c=2 1000w');
        expect(c('{{getImageSrcset image_with_2_qs 100w="100w" 200w="200w" 300w="300w" 1000w="1000w"}}', context))
            .to.be.equal('https://cdn.example.com/path/to/100w/image.png?c=2&imbypass=on 100w, https://cdn.example.com/path/to/200w/image.png?c=2&imbypass=on 200w, https://cdn.example.com/path/to/300w/image.png?c=2&imbypass=on 300w, https://cdn.example.com/path/to/1000w/image.png?c=2&imbypass=on 1000w');
        expect(c('{{getImageSrcset image 1x="768x768" 2x="1536x1536"}}', context))
            .to.be.equal('https://cdn.example.com/path/to/768x768/image.png?c=2 1x, https://cdn.example.com/path/to/1536x1536/image.png?c=2 2x');
        done();
    });

    it('should return a srcset made of default sizes if requested', function(done) {
        expect(c('{{getImageSrcset image use_default_sizes=true}}', context))
            .to.be.equal('https://cdn.example.com/path/to/80w/image.png?c=2 80w, https://cdn.example.com/path/to/160w/image.png?c=2 160w, https://cdn.example.com/path/to/320w/image.png?c=2 320w, https://cdn.example.com/path/to/640w/image.png?c=2 640w, https://cdn.example.com/path/to/960w/image.png?c=2 960w, https://cdn.example.com/path/to/1280w/image.png?c=2 1280w, https://cdn.example.com/path/to/1920w/image.png?c=2 1920w, https://cdn.example.com/path/to/2560w/image.png?c=2 2560w');
        done();
    });

    it('should return empty string if no parameters are passed', function(done) {
        expect(c('{{getImageSrcset image}}', context))
            .to.be.equal('');
        done();
    });

    it('should return a srcset without a descriptor if a valid image and single srcset size is passed', function(done) {
        expect(c('{{getImageSrcset image 100w="100w"}}', context))
            .to.be.equal('https://cdn.example.com/path/to/100w/image.png?c=2');
        expect(c('{{getImageSrcset image 1x="768x768"}}', context))
            .to.be.equal('https://cdn.example.com/path/to/768x768/image.png?c=2');
        done();
    });


    it('should return a url if a url is passed', function(done) {
        expect(c('{{getImageSrcset "http://example.com/image.jpg"}}', context))
            .to.be.equal('http://example.com/image.jpg');
        expect(c('{{getImageSrcset "https://example.com/image.jpg"}}', context))
            .to.be.equal('https://example.com/image.jpg');
        done();
    });

    it('should return empty if srcset array is invalid', function(done) {
        expect(c('{{getImageSrcset image 100="100w"}}', context))
            .to.be.equal('');
        expect(c('{{getImageSrcset image abc="def"}}', context))
            .to.be.equal('');
        done();
    });

    it('should return empty if image is invalid', function(done) {
        expect(c('{{getImageSrcset not_existing_image 100w="100w" 200w="200w"}}', context))
            .to.be.equal('');
        expect(c('{{getImageSrcset not_an_image 100w="100w" 200w="200w"}}', context))
            .to.be.equal('');
        done();
    });

    it('should use the default image url if image is invalid', function(done) {
        expect(c('{{getImageSrcset not_an_image "http://image" 100w="100w" 200w="200w"}}', context))
            .to.be.equal('http://image');
        expect(c('{{getImageSrcset not_an_image image_url 100w="100w" 200w="200w"}}', context))
            .to.be.equal(context.image_url);
        done();
    });
});
