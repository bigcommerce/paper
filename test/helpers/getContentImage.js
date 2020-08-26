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

describe('getContentImage helper', function() {
    const settings = {
        cdn_url: 'https://cdn.bcapp/3dsf74g',
    };
    const context = {
        object: {a:1}
    };

    it('should return an original image if no size is passed', function(done) {
        expect(c('{{getContentImage "asset.jpg"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/content/asset.jpg');
        expect(c('{{getContentImage "folder/asset.jpg"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/content/folder/asset.jpg');
        done();
    });

    it('should return an original image if invalid sizes are passed', function(done) {
        expect(c('{{getContentImage "asset.jpg" width="a"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/content/asset.jpg');
        expect(c('{{getContentImage "asset.jpg" width="a" height="a"}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/content/asset.jpg');
        expect(c('{{getContentImage "asset.jpg" height=123}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/content/asset.jpg');
        expect(c('{{getContentImage "folder/asset.jpg" height=123}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/original/content/folder/asset.jpg');
        done();
    });

    it('should return an original image if invalid sizes are passed', function(done) {
        expect(c('{{getContentImage "asset.jpg" width=123}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/123w/content/asset.jpg');
        expect(c('{{getContentImage "folder/asset.jpg" width=123}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/123w/content/folder/asset.jpg');
        expect(c('{{getContentImage "asset.jpg" width=123 height=321}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/123x321/content/asset.jpg');
        expect(c('{{getContentImage "folder/asset.jpg" width=123 height=321}}', context, settings))
            .to.be.equal('https://cdn.bcapp/3dsf74g/images/stencil/123x321/content/folder/asset.jpg');
        done();
    });

    it('should throw an exception if a url is passed', function (done) {
        try {
            c('{{getContentImage "http://example.com/image.jpg"}}');
        } catch(e) {
            done();
        }
    });

    it('should throw an exception if a non-string is passed', function (done) {
        try {
            c('{{getContentImage object}}');
        } catch(e) {
            try {
                c('{{getContentImage 123');
            } catch(e) {
                done();
            }
        }
    });
});
