var _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('getGoogleFontsCollection', function() {
        var fontKeyFormat = new RegExp(/\w+-font$/),
            collection = '';

        _.each(context.theme_settings, function(value, key) {
            var family,
                pair,
                weight;

            if (fontKeyFormat.test(key)) {
                pair = value.split('_');
                family = pair[0];
                weight = pair[1];

                family = family.trim();
                family = family.replace(' ', '+');

                if (pair.length === 1) {
                    collection += family + '|';
                } else if (pair.length === 2) {
                    collection += family + ':' + weight + '|';
                }
            }
        });

        return collection;
    });
};

module.exports = internals.implementation;
