var _ = require('lodash');

module.exports = function (paper, handlebars, context) {
    handlebars.registerHelper('getImage', function (image, preset, defaultImage) {
        var presets = context.theme_images || {},
            width,
            height,
            size,
            url;

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
