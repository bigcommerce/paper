'use strict';
const isObject = require('../lib/utils/isObject');

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#or 1 0 0 0 0 0}} ... {{/or}}
 */
function helper(paper) {
    paper.handlebars.registerHelper('or', function (...args) {
        const opts = args.pop();
        let any;

        // Without options hash, we check all the arguments
        any = args.some(arg => {
            if (Array.isArray(arg)) {
                return !!arg.length;
            }
            if (isObject(arg) && !Object.keys(arg).length) {
                return false;
            }
            return !!arg;
        });

        return any ? opts.fn(this) : opts.inverse(this);
    });
}

module.exports = helper;
