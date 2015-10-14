var _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('getFontsUrl', function() {
        var fontKeyFormat = new RegExp(/\w+_font$/),
            url = '';

        _.each(context.theme_settings, function(value, key) {
            var family,
                pair,
                weight;

            if (fontKeyFormat.test(key)) {
                pair = value.split('_');
                family = pair[0];
                weight = pair[1];

                if (pair.length === 1) {
                    url += family + '|';
                } else if (pair.length === 2) {
                    url += family + ':' + weight + '|';
                }
            }
        });

        return 'https://fonts.googleapis.com/css?family=' + url;
    });
};

module.exports = internals.implementation;
