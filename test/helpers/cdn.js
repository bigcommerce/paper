var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    return Paper.compile('template', {template: template}, context);
}

describe('cdn helper', function() {
    var context = {
        cdn_url_with_settings_hash: 'https://cdn.bcapp/sfge342',
        cdn_url: 'https://cdn.bcapp/3dsf74g',
    };

    it('should render an object properly', function(done) {

        expect(c('{{cdn "/assets/css/style.css"}}', context))
            .to.be.equal('https://cdn.bcapp/sfge342/assets/css/style.css');

        done();
    });

    it('should render normal url', function(done) {

        expect(c('{{cdn "/assets/js/app.js"}}', context))
            .to.be.equal('https://cdn.bcapp/3dsf74g/assets/js/app.js');

        done();
    });

    it('should properly render url', function(done) {

        expect(c('{{cdn "assets/js/app.js"}}', context))
            .to.be.equal('https://cdn.bcapp/3dsf74g/assets/js/app.js');

        done();
    });
});
