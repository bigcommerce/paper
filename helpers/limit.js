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
    this.handlebars.registerHelper('limit', function(data, limit) {

        if (_.isString(data)) {
            return data.substring(0, limit);
        }
        if (!_.isArray(data)) {
            return [];
        }

        return data.slice(0, limit);
    });
};

module.exports = internals.implementation;
