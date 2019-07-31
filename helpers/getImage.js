'use strict';

var _ = require('lodash');
const SafeString = require('handlebars').SafeString;
const common = require('./../lib/common');

function helper(paper) {
    paper.handlebars.registerHelper('getImage', function (image, presetName, defaultImageUrl) {
        var sizeRegex = /^(\d+?)x(\d+?)$/g;
        var settings = paper.themeSettings || {};
        var presets = settings._images;
        var size;
        var width;
        var height;

        if (!_.isPlainObject(image) || !_.isString(image.data)
            || !common.isValidURL(image.data) || image.data.indexOf('{:size}') === -1) {
            // return empty string if not a valid image object
            defaultImageUrl = defaultImageUrl ? defaultImageUrl : '';
            return _.isString(image) ? image : defaultImageUrl;
        }

        if (_.isPlainObject(presets) && _.isPlainObject(presets[presetName])) {
            // If preset is one of the given presets in _images
            width = parseInt(presets[presetName].width, 10) || 5120;
            height = parseInt(presets[presetName].height, 10) || 5120;
            size = `${width}x${height}`;
        } else if (sizeRegex.test(settings[presetName])) {
            // If preset name is a setting and match the NNNxNNN format
            size = settings[presetName];
            width = parseInt(size.split('x')[0], 10);
            height = parseInt(size.split('x')[1], 10);
        } else {
            // Use the original image size
            size = 'original';
        }

        if (Number.isInteger(image.width) && Number.isInteger(image.height)
            && Number.isInteger(width) && Number.isInteger(height)) {
            size = `${Math.min(image.width, width)}x${Math.min(image.height, height)}`
        }

        return new SafeString(image.data.replace('{:size}', size));
    });
};

module.exports = helper;
