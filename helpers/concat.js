'use strict';

/**
 * Concats two values, primarily used as a subhelper
 * @example
 *  {{@lang (concat 'products.reviews.rating.' this) }}
 */
function helper(paper) {
    paper.handlebars.registerHelper('concat', function (value, otherValue) {
        return `${value}${otherValue}`;
    });
}

module.exports = helper;
