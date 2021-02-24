'use strict';

/**
 * Concats two values, primarily used as a subhelper
 * @example
 *  {{@lang (concat 'products.reviews.rating.' this) }}
 */
function helper(paper) {
    paper.handlebars.registerHelper('concat', function (value, otherValue, returnSafeString =  true) {
        // if returnSafeString set to true the returned value will be from SafeString type
        if (returnSafeString) {
            return new paper.handlebars.SafeString(value + otherValue);
        }

        return `${value}${otherValue}`;
    });
}

module.exports = helper;
