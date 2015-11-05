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

describe('stylesheet helper', function() {
    var context = {
        settings: {
            cdn_url: 'https://cdn.bcapp/hash',
            theme_version_id: '1',
            theme_config_id: '2',
        }
    }

    it('should render a link tag with the cdn ulr and stencil-stylesheet data tag', function(done) {
        expect(c('{{{stylesheet "assets/css/style.css"}}}', context))
            .to.be.equal('<link data-stencil-stylesheet href="https://cdn.bcapp/hash/stencil/1/2/css/style.css" rel="stylesheet" id="https://cdn.bcapp/hash/stencil/1/2/css/style.css">');

        done();
    });

    it('should render a link tag and all extra attributes with no cdn url', function(done) {
        expect(c('{{{stylesheet "assets/css/style.css" rel="something" class="myStyle"}}}', {}))
            .to.be.equal('<link data-stencil-stylesheet href="/assets/css/style.css" rel="something" class="myStyle" id="/assets/css/style.css">');

        done();
    });

    it('should render a link with empty href', function(done) {
        expect(c('{{{stylesheet "" }}}', context))
            .to.be.equal('<link data-stencil-stylesheet href="" rel="stylesheet" id="">');

        done();
    });
});
