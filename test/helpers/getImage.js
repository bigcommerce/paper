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
    var context = {
        customizedSize: '600x300',
        image: {
            data: '/path/to/{:size}/image.png'
        },
        logoPreset: 'logo',
        theme_settings: {
            _images: {
                logo: {
                    width: 250,
                    height: 100
                },
                gallery: {
                    width: 300,
                    height: 300
                }
            }
        }
    };

    it('should return original for unregistered image preset', function(done) {

        var expectedPath = context.image.data.replace('{:size}', 'original');

        expect(c('{{getImage image "badPreset"}}', context)).to.be.equal(expectedPath);

        done();
    });

    it('should return original for original image preset', function(done) {

        var expectedPath = context.image.data.replace('{:size}', 'original');

        expect(c('{{getImage image "original"}}', context)).to.be.equal(expectedPath);

        done();
    });

    it('should return customized size for customized image preset', function(done) {

        var expectedPath = context.image.data.replace('{:size}', context.customizedSize);

        expect(c('{{getImage image customizedSize}}', context)).to.be.equal(expectedPath);

        done();
    });

    it('should return logo size for logo preset', function(done) {

        var logoPresets = context.theme_settings._images[context.logoPreset];
        var logoDimension = logoPresets.width + 'x' + logoPresets.height;
        var expectedPath = context.image.data.replace('{:size}', logoDimension);

        expect(c('{{getImage image logoPreset}}', context)).to.be.equal(expectedPath);

        done();
    });
});
