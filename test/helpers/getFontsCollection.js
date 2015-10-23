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

describe('fonts helper', function() {
    var context = {
        theme_settings: {
            'test1-font': 'Google_Open+Sans_400',
            'test2-font': 'Google_Karla_700',
            'test3-font': 'Google_Lora_400_sans',
            'test4-font': 'Google_Volkron',
            'test5-font': 'Google_Droid_400,700',
            'test6-font': 'Google_Crimson+Text_400,700_sans',
            'random-property': 'not a font'
        }
    };

    it('should return the expected font url', function(done) {
        var template = "{{getFontsCollection}}";

        expect(c(template, context))
            .to.be.equal('<link href="//fonts.googleapis.com/css?family=Open+Sans:400|Karla:700|Lora:400|Volkron|Droid:400|Crimson+Text:400|" rel="stylesheet">');
        done();
    });
});
