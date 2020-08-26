var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context, settings) {
    const themeSettings = {};
    return new Paper(settings, themeSettings).loadTemplatesSync({template: template}).render('template', context);
}

describe('getImageSrcset helper', function() {
    const settings = {
        cdn_url: 'https://cdn.bcapp/3dsf74g',
    };
    const context = {
        object: {a:1}
    };

    it('should return a valid srcset', function(done) {
        expect(c('{{getImageManagerImageSrcset "asset.jpg"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/80w/image-manager/asset.jpg 80w, https://cdn.bcapp/3dsf74g/images/stencil/160w/image-manager/asset.jpg 160w, https://cdn.bcapp/3dsf74g/images/stencil/320w/image-manager/asset.jpg 320w, https://cdn.bcapp/3dsf74g/images/stencil/640w/image-manager/asset.jpg 640w, https://cdn.bcapp/3dsf74g/images/stencil/960w/image-manager/asset.jpg 960w, https://cdn.bcapp/3dsf74g/images/stencil/1280w/image-manager/asset.jpg 1280w, https://cdn.bcapp/3dsf74g/images/stencil/1920w/image-manager/asset.jpg 1920w, https://cdn.bcapp/3dsf74g/images/stencil/2560w/image-manager/asset.jpg 2560w');
        expect(c('{{getImageManagerImageSrcset "folder/asset.jpg"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/80w/image-manager/folder/asset.jpg 80w, https://cdn.bcapp/3dsf74g/images/stencil/160w/image-manager/folder/asset.jpg 160w, https://cdn.bcapp/3dsf74g/images/stencil/320w/image-manager/folder/asset.jpg 320w, https://cdn.bcapp/3dsf74g/images/stencil/640w/image-manager/folder/asset.jpg 640w, https://cdn.bcapp/3dsf74g/images/stencil/960w/image-manager/folder/asset.jpg 960w, https://cdn.bcapp/3dsf74g/images/stencil/1280w/image-manager/folder/asset.jpg 1280w, https://cdn.bcapp/3dsf74g/images/stencil/1920w/image-manager/folder/asset.jpg 1920w, https://cdn.bcapp/3dsf74g/images/stencil/2560w/image-manager/folder/asset.jpg 2560w');
        done();
    });

    it('should throw an exception if a url is passed', function (done) {
        try {
            c('{{getImageManagerImageSrcset "http://example.com/image.jpg"}}');
        } catch(e) {
            done();
        }
    });

    it('should throw an exception if a non-string is passed', function (done) {
        try {
            c('{{getImageManagerImageSrcset object}}');
        } catch(e) {
            try {
                c('{{getImageManagerImageSrcset 123');
            } catch(e) {
                done();
            }
        }
    });
});
