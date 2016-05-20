var _ = require('lodash');

var implementation = function(handlebars) {
    this.handlebars = handlebars;
};

implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('getImage', function (image, presetName, defaultImage) {
        var sizeRegex = /^(\d+?)x(\d+?)$/g;
        var settings = context.theme_settings || {};
        var presets = settings._images;
        var size = 'original';

        if (!_.isPlainObject(image) || !_.isString(image.data) || image.data.indexOf('{:size}') === -1) {
            // return empty string if not a valid image object
            return '';
        }

        if (_.isPlainObject(presets) && _.isPlainObject(presets[presetName])) {
            // If preset is one of the given presets in _images
            width = parseInt(presets[presetName].width, 10) || 4098;
            height = parseInt(presets[presetName].height, 10) || 4098;
            size = width + 'x' + height;

        } else if (sizeRegex.test(settings[presetName])) {
            // If preset name is a setting and match the NNNxNNN format
            size = settings[presetName];

        } else if (sizeRegex.test(defaultImage)) {
            size = defaultImage;
        }

        return image.data.replace('{:size}', size);
    });
};

module.exports = implementation;
