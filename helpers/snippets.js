var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function() {

    this.handlebars.registerHelper('snippet', function(location) {
        return '<!-- snippet location ' + location + ' -->';
    });
};

module.exports = internals.implementation;
