var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function() {
    var self = this;

    this.handlebars.registerHelper('pre', function (value) {
        var string = JSON.stringify(value, null, 2);

        string = self.handlebars.Utils.escapeExpression(string);

        return '<pre>' + string + '</pre>';
    });
};

module.exports = internals.implementation;
