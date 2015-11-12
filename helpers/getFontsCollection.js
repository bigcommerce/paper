var _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    var handlebars = this.handlebars;

    handlebars.registerHelper('getFontsCollection', function() {
        var fontKeyFormat = new RegExp(/\w+(-\w*)*-font$/),
            googleFonts = [],
            linkElements = [];

        _.each(context.theme_settings, function(value, key) {
            var split;

            if (fontKeyFormat.test(key)) {
                split = value.split('_');

                switch (split[0]) {
                    case 'Google':
                        googleFonts.push(value);
                        break;

                    default:
                        break;
                }
            }
        });

        linkElements.push(internals.googleParser(googleFonts));

        return new handlebars.SafeString(linkElements.join(''));
    });
};

/**
 * Parser for Google fonts
 *
 * @param fonts - Array of fonts that might look like
 * Google_Open+Sans or Google_Open+Sans_400 or Google_Open+Sans_400_sans or Google_Open+Sans_400,700_sans
 * for Shopify compatibility
 *
 * @returns {string}
 */

internals.googleParser = function(fonts) {
    var collection = '';

    _.each(fonts, function(font) {
        var split = font.split('_'),
            family = split[1],
            weight = split[2];

        if (split.length === 2) {
            collection += family + '|';
        } else if (split.length > 2) {
            weight = weight.split(',')[0];
            collection += family + ':' + weight + '|';
        }
    });

    return '<link href="//fonts.googleapis.com/css?family=' + collection + '" rel="stylesheet">';
};

module.exports = internals.implementation;
