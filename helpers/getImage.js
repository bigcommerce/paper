var _ = require('lodash'),
    internals = {};

/**
 * Format Size
 *
 */
function imageSize(preset, presets) {

    // default image size to 'original'
    var _preset = '_images.' + preset,
        dimension,
        height,
        width,
        size = 'original';

    if (_.isString(preset)) {

        // If preset is one of the given presets (default preset)
        if (/^\d+x\d+$/.test(preset)) {
            size = preset;
        }

        //If preset is editable by the user
        if (presets.hasOwnProperty(_preset)) {
            dimension = presets[_preset];
            width = _.values(dimension[0])[0] || 100;
            height = _.values(dimension[1])[0] || 100;
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
        var presets = context.theme_settings,
            size,
            url;

        if (!_.isObject(image)) {
            return _.isString(image) ? image : defaultImage;
        }

        url = image.data || '';

        size = imageSize(preset, presets);

        return url.replace('{:size}', size);
    });
};

module.exports = internals.implementation;
