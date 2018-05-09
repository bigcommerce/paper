var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, themeSettings) {
    return new Paper({}, themeSettings).loadTemplatesSync({template: template}).render('template', {});
}

describe('getFontLoaderConfig helper', function () {
    it('should return the expected font url', function (done) {
        const themeSettings = {
            'test1-font': 'Google_Open+Sans',
            'test2-font': 'Google_Open+Sans_400italic',
            'test3-font': 'Google_Open+Sans_700',
            'test4-font': 'Google_Karla_700',
            'test5-font': 'Google_Lora_400_sans',
            'test6-font': 'Google_Volkron',
            'test7-font': 'Google_Droid_400,700',
            'test8-font': 'Google_Crimson+Text_400,700_sans',
            'random-property': 'not a font'
        };

        const template = "{{getFontLoaderConfig}}";
        const expectedConfig = {
            google: {
                families: ['Open Sans:,400italic,700', 'Karla:700', 'Lora:400', 'Volkron:', 'Droid:400,700', 'Crimson Text:400,700']
            }
        };

        expect(c(template, themeSettings)).to.be.equal(JSON.stringify(expectedConfig));
        done();
    });
});
