'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('lang', function (translationKey) {
        const options = arguments[arguments.length - 1];

        if (typeof paper.translate === 'function') {
            return paper.translate(translationKey, options.hash);
        }
    });
}

module.exports = helper;
