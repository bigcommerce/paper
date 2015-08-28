var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    var self = this;
    // https://github.com/danharper/Handlebars-Helpers/blob/master/src/helpers.js#L89
    this.handlebars.registerHelper('nl2br', function(text) {
        var nl2br = (self.handlebars.escapeExpression(text) + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new self.handlebars.SafeString(nl2br);
    });
};

module.exports = internals.implementation;
