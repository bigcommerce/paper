var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('json', function (data) {
        return JSON.stringify(data);
    });
};

module.exports = internals.implementation;
