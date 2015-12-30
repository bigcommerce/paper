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

describe('cdn helper', function() {
    var context = {
        settings: {
            cdn_url: 'https://cdn.bcapp/3dsf74g',
            theme_version_id: '123',
            theme_config_id: '3245',
        }
    };

    it('should render the css cdn url', function(done) {
        expect(c('{{cdn "assets/css/style.css"}}', context))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/3245/css/style.css');

        expect(c('{{cdn "/assets/css/style.css"}}', context))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/3245/css/style.css');

        done();
    });

    it('should render normal assets cdn url', function(done) {
        expect(c('{{cdn "assets/js/app.js"}}', context))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/3245/js/app.js');

        expect(c('{{cdn "assets/img/image.jpg"}}', context))
            .to.be.equal('https://cdn.bcapp/3dsf74g/stencil/123/3245/img/image.jpg');

        done();
    });

    it('should not use the cdn url', function(done) {
        expect(c('{{cdn "assets/img/image.jpg"}}', {}))
            .to.be.equal('/assets/img/image.jpg');

        expect(c('{{cdn "assets/img/image.jpg"}}', {}))
            .to.be.equal('/assets/img/image.jpg');

        done();
    });

    it('should return the same value if it is a full url', function(done) {

        expect(c('{{cdn "https://example.com/app.js"}}', context))
            .to.be.equal('https://example.com/app.js');

        expect(c('{{cdn "http://example.com/app.js"}}', context))
            .to.be.equal('http://example.com/app.js');

        expect(c('{{cdn "//example.com/app.js"}}', context))
            .to.be.equal('//example.com/app.js');

        done();
    });

    it('should return  an empty string if no path is provided', function(done) {

        expect(c('{{cdn ""}}', context))
            .to.be.equal('');

        done();
    });

    it('should return a webDav asset if webdav protocol specified', function(done) {

        expect(c('{{cdn "webdav:img/image.jpg"}}', context))
            .to.be.equal('https://cdn.bcapp/3dsf74g/content/img/image.jpg');

        expect(c('{{cdn "webdav:/img/image.jpg"}}', context))
            .to.be.equal('https://cdn.bcapp/3dsf74g/content/img/image.jpg');

        done();
    });

    it('should not return a webDav asset if webdav protocol is not correct', function(done) {

        expect(c('{{cdn "webbav:img/image.jpg"}}', context))
            .to.be.equal('/img/image.jpg');

        expect(c('{{cdn "webbav:/img/image.jpg"}}', context))
            .to.be.equal('/img/image.jpg');

        done();
    });

    it('should return basic asset URL if protocol is not correct', function(done) {

        expect(c('{{cdn "randomProtocol::img/image.jpg"}}', context))
            .to.be.equal('/img/image.jpg');

        expect(c('{{cdn "randomProtocol:/img/image.jpg"}}', context))
            .to.be.equal('/img/image.jpg');

        done();
    });
});
