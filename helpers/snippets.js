var _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context, paper) {

    this.handlebars.registerHelper('snippet', function(location, options) {
        return '<!-- snippet location ' + location + ' -->';
    });
};

module.exports = internals.implementation;
