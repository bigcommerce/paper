'use strict';

const getFonts = require('../lib/fonts');

module.exports = function(paper) {
    const handlebars = paper.handlebars;

    handlebars.registerHelper('getFontLoaderConfig', function () {
        return new handlebars.SafeString(JSON.stringify(getFonts(paper, 'webFontLoaderConfig')));
    });
};
