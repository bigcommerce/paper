var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function() {
    this.handlebars.registerHelper('toLowerCase', function(string) {

        if (typeof string !== 'string') {
            return string;
        }

        return string.toLowerCase();
    });
};

module.exports = internals.implementation;
