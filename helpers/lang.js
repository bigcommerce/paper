'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('lang', function (translationKey, options) {
    	if (typeof paper.translate === 'function') {
        	return paper.translate(translationKey, options.hash);
        }
    });
}

module.exports = helper;
