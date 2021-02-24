'use strict';

const includes = require('../lib/utils/includes');

/**
 * Is any value included in a collection or a string?
 *
 * @example
 * {{#contains fonts "Roboto"}} ... {{/contains}}
 * {{#contains font_path "Roboto"}} ... {{/contains}}
 */
function helper(paper) {
    paper.handlebars.registerHelper('contains', function (...args) {
        const options = args.pop();
        const contained = includes(...args);

        // Yield block if true
        return contained ? options.fn(this) : options.inverse(this);
    });
}

module.exports = helper;
