var _ = require('lodash'),
    internals = {};

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#any items selected=true}} ... {{/any}}
 */

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('any', function(collection, options) {
        var predicate = options.hash,
            any = _.any(collection, predicate);

        if (any) {
            return options.fn(this);
        }

        return options.inverse(this);
    });
};

module.exports = internals.implementation;
