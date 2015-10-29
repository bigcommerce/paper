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

describe('style helper', function() {
    var context = {
        settings: {
            cdn_url: 'https://cdn.bcapp/hash',
            theme_version_id: '1',
            theme_config_id: '2',
        }
    }

    it('should render a link tag with the cdn ulr and stencil-style data tag', function(done) {
        expect(c('{{{style "assets/css/style.css"}}}', context))
            .to.be.equal('<link data-stencil-style href="https://cdn.bcapp/hash/stencil/1/2/css/style.css">');

        done();
    });

    it('should render a link tag  all extra attributes and no cdn', function(done) {
        expect(c('{{{style "assets/css/style.css" rel="stylesheet" class="myStyle"}}}', {}))
            .to.be.equal('<link data-stencil-style href="/assets/css/style.css" class="myStyle" rel="stylesheet">');

        done();
    });

});
