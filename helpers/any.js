var _ = require('lodash');
/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#any items selected=true}} ... {{/any}}
 */
module.exports = function (paper) {
    paper.handlebars.registerHelper('any', function(collection, options) {
        var predicate = options.hash,
            any = _.any(collection, predicate);

        if (any) {
            return options.fn(this);
        }

        return options.inverse(this);
    });
};
