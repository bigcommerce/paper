'use strict';

/**
 * Limit an array to the second argument
 *
 * @example
 * {{limit array 4}}
 */
function helper(paper) {
    paper.handlebars.registerHelper('limit', function (data, limit) {
        if (typeof data === 'string') {
            return data.substring(0, limit);
        }
        if (!Array.isArray(data)) {
            return [];
        }

        return data.slice(0, limit);
    });
}

module.exports = helper;
