'use strict';

const getFonts = require('../lib/fonts');

module.exports = function(paper) {
    const handlebars = paper.handlebars;

    handlebars.registerHelper('getFontsCollection', function () {
        return getFonts(paper, 'linkElements');
    });
};
