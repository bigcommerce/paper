'use strict';
const { getObjectStorageImage } = require('../lib/getObjectStorageImage')

function helper(paper) {
    paper.handlebars.registerHelper('getImageManagerImage', function(path) {
        const cdnUrl = paper.settings['cdn_url'] || '';

        const options = arguments[arguments.length - 1];

        return getObjectStorageImage(cdnUrl, 'image-manager', path, options);
    });
}

module.exports = helper;
