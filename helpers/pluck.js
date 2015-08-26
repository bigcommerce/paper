var _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('pluck', function(collection, path) {
        return _.pluck(collection, path);
    });
};

module.exports = internals.implementation;
