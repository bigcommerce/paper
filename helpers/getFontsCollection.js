'use strict';

const getFonts = require('../lib/fonts');

module.exports = function(paper) {
    const handlebars = paper.handlebars;

    handlebars.registerHelper('getFontsCollection', function (options) {
        const fontDisplay = options && options.hash['font-display'] ? options.hash['font-display'] : null;
        return getFonts(paper, 'linkElements', {fontDisplay});
    });
};
