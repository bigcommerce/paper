/**
 * Concats two values, primarily used as a subhelper
 * @example
 *  {{@lang (concat 'products.reviews.rating.' this) }}
 */
var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    var self = this;

    this.handlebars.registerHelper('concat', function (value, otherValue) {
        return new self.handlebars.SafeString(value + otherValue);
    });
};

module.exports = internals.implementation;
