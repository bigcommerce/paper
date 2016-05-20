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

describe('getImage helper', function() {
    var urlData = 'https://cdn.example.com/path/to/{:size}/image.png';
    var context = {     
        not_an_image: '#123456',
        image: {
            data: urlData
        },
        logoPreset: 'logo',
        theme_settings: {
            logo_image: '600x300',
            gallery: '100x100',
            _images: {
                logo: {
                    width: 250,
                    height: 100
                },
                gallery: {
                    width: 300,
                    height: 300
                },
                missing_values: {},
                missing_width: {height: 100}
            }
        }
    };

    it('should return empty if image is invalid', function(done) {

        expect(c('{{getImage not_existing_image}}', context))
            .to.be.equal('');

        expect(c('{{getImage "just a string"}}', context))
            .to.be.equal('');

        expect(c('{{getImage not_an_image}}', context))
            .to.be.equal('');

        done();
    });

    it('should use the preset from _images', function(done) {

        expect(c('{{getImage image "logo"}}', context))
            .to.be.equal(urlData.replace('{:size}', '250x100'));

        expect(c('{{getImage image "gallery"}}', context))
            .to.be.equal(urlData.replace('{:size}', '300x300'));

        done();
    });

    it('should use the size from the theme_settings', function(done) {

        expect(c('{{getImage image "logo_image"}}', context))
            .to.be.equal(urlData.replace('{:size}', '600x300'));

        done();
    });

    it('should use the default value if is valid otherwise use "original"', function(done) {

        expect(c('{{getImage image "bad_preset" "123x123"}}', context))
            .to.be.equal(urlData.replace('{:size}', '123x123'));

        expect(c('{{getImage image "bad_preset" "123V123"}}', context))
            .to.be.equal(urlData.replace('{:size}', 'original'));

        expect(c('{{getImage image "bad_preset" "original"}}', context))
            .to.be.equal(urlData.replace('{:size}', 'original'));

        done();
    });

    it('should use original size if not default is passed', function(done) {

        expect(c('{{getImage image "bad_preset"}}', context))
            .to.be.equal(urlData.replace('{:size}', 'original'));

        done();
    });

    
    it('should default to max value (width & height) if value is not provided', function(done) {

        expect(c('{{getImage image "missing_values"}}', context))
            .to.be.equal(urlData.replace('{:size}', '4098x4098'));

        expect(c('{{getImage image "missing_width"}}', context))
            .to.be.equal(urlData.replace('{:size}', '4098x100'));

        done();
    });


});
