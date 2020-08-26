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

describe('getImageManagerImage helper', function() {
    const settings = {
        cdn_url: 'https://cdn.bcapp/3dsf74g',
    };
    const context = {
        object: {a:1}
    };

    it('should return an original image if no size is passed', function(done) {
        expect(c('{{getImageManagerImage "asset.jpg"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/asset.jpg');
        expect(c('{{getImageManagerImage "folder/asset.jpg"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/folder/asset.jpg');
        done();
    });

    it('should return an original image if invalid sizes are passed', function(done) {
        expect(c('{{getImageManagerImage "asset.jpg" width="a"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/asset.jpg');
        expect(c('{{getImageManagerImage "asset.jpg" width="a" height="a"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/asset.jpg');
        expect(c('{{getImageManagerImage "asset.jpg" height=123}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/asset.jpg');
        expect(c('{{getImageManagerImage "folder/asset.jpg" height=123}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/image-manager/folder/asset.jpg');
        done();
    });

    it('should return an original image if invalid sizes are passed', function(done) {
        expect(c('{{getImageManagerImage "asset.jpg" width=123}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/123w/image-manager/asset.jpg');
        expect(c('{{getImageManagerImage "folder/asset.jpg" width=123}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/123w/image-manager/folder/asset.jpg');
        expect(c('{{getImageManagerImage "asset.jpg" width=123 height=321}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/123x321/image-manager/asset.jpg');
        expect(c('{{getImageManagerImage "folder/asset.jpg" width=123 height=321}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/123x321/image-manager/folder/asset.jpg');
        done();
    });

    it('should throw an exception if a url is passed', function (done) {
        try {
            c('{{getImageManagerImage "http://example.com/image.jpg"}}');
        } catch(e) {
            done();
        }
    });

    it('should throw an exception if a non-string is passed', function (done) {
        try {
            c('{{getImageManagerImage object}}');
        } catch(e) {
            try {
                c('{{getImageManagerImage 123');
            } catch(e) {
                done();
            }
        }
    });
});
