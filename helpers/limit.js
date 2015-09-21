var _ = require('lodash'),
    internals = {};

/**
 * Limit an array to the second argument
 *
 * @example
 * {{limit array 4}}
 */

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('limit', function(arr, limit) {
        if (!_.isArray(arr)) {
            return [];
        }

        return arr.slice(0, limit);
    });
};

module.exports = internals.implementation;
