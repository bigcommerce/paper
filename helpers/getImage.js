var _ = require('lodash'),
    internals = {};

/**
 * Format Size
 *
 */
function imageSize(preset, presets) {

    // default image size to 'original'
    var width,
        height,
        size = 'original';

    if (_.isString(preset)) {

        // If preset is provided by the user
        if (preset.indexOf('x') > 0) {
            size = preset;
        }

        // If preset is one of the given presets
        if (_.isObject(presets[preset])) {
            width = presets[preset].width || 100;
            height = presets[preset].height || 100;
            size = width + 'x' + height;
        }

    }

    return size;
}

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('getImage', function (image, preset, defaultImage) {
        var presets = {},
            size,
            url;

        if (context.theme_settings && context.theme_settings._images) {
            presets = context.theme_settings._images;
        }

        if (!_.isObject(image)) {
            return _.isString(image) ? image : defaultImage;
        }

        url = image.data || '';

        size = imageSize(preset, presets);

        return url.replace('{:size}', size);
    });
};

module.exports = internals.implementation;
