/**
 * Concats two values, primarily used as a subhelper
 * @example
 *  {{@lang (concat 'products.reviews.rating.' this) }}
 */
module.exports = function (paper, handlebars) {
    handlebars.registerHelper('concat', function (value, otherValue) {
        return new handlebars.SafeString(value + otherValue);
    });
};
