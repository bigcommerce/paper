'use strict';
const isObject = require('../lib/utils/isObject');

/**
 * Yield block only if all arguments are valid
 *
 * @example
 * {{#all items theme_settings.optionA theme_settings.optionB}} ... {{/all}}
 */
function helper(paper) {
    paper.handlebars.registerHelper('all', function (...args) {
        const opts = args.pop();
        let result;

        // Check if all the arguments are valid / truthy
        result = args.every(arg => {
            if (Array.isArray(arg)) {
                return !!arg.length;
            }
            if (isObject(arg) && !Object.keys(arg).length) {
                return false;
            }
            return !!arg;
        });

        // If everything was valid, then "all" condition satisfied
        return result ? opts.fn(this) : opts.inverse(this);
    });
}

module.exports = helper;
