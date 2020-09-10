'use strict';
const isObject = require('../lib/utils/isObject');
const isMatch = require("../lib/utils/isMatch");

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#any items selected=true}} ... {{/any}}
 */
function helper(paper) {
    paper.handlebars.registerHelper('any', function (...args) {
        const opts = args.pop();
        let any;

        // With options hash, we check the contents of first argument
        if (opts.hash && Object.keys(opts.hash).length) {
            // This works fine for both arrays and objects
            any = isObject(args[0]) && Object.values(args[0]).some(item => isMatch(item, opts.hash));
        } else {
            // DEPRECATED: Moved to #or helper
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
        }

        return any ? opts.fn(this) : opts.inverse(this);
    });
}

module.exports = helper;
