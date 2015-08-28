var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('replace', function(needle, haystack, options) {
        var contains = haystack.indexOf(needle) > -1;

        // Yield block if true
        if (contains) {
            return haystack.replace(new RegExp(needle, 'g'), options.fn(this));
        } else {
            return options.inverse(this);
        }
    });
};

module.exports = internals.implementation;
