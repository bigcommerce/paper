var Path = require('path'),
    _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context, paper) {
    var self = this;

    this.handlebars.registerHelper('dynamicComponent', function(path) {
        var template;

        if (!this['partial']) {
            return;
        }

        // prevent access to __proto__ 
        // or any hidden object properties
        path = path.replace('__', '');

        // We don't want a slash as a prefix
        if (path[0] === '/') {
            path = path.substr(1);
        }

        path = Path.join(path, this['partial']);

        if (self.handlebars.partials[path]) {

            return self.handlebars.partials[path](this);
        }
    });
};

module.exports = internals.implementation;
