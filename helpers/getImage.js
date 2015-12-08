var _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('getImage', function (image, preset, defaultImage) {
        var presets = {},
            width,
            height,
            size,
            url;

        if (context.theme_settings && context.theme_settings._images) {
            presets = context.theme_settings._images;
        }

        if (!_.isObject(image)) {
            return _.isString(image) ? image : defaultImage;
        }

        url = image.data || '';

        if (_.isObject(presets[preset])) {
            width = presets[preset].width || 100;
            height = presets[preset].height || 100;
            size = width + 'x' + height;
        } else {
            size = 'original';
        }

        return url.replace('{:size}', size);
    });
};

module.exports = internals.implementation;
