'use strict';
const { getObjectStorageImageSrcset } = require('../lib/getObjectStorageImage')

function helper(paper) {
    paper.handlebars.registerHelper('getImageManagerImageSrcset', function(path) {
        const cdnUrl = paper.settings['cdn_url'] || '';

        return getObjectStorageImageSrcset(cdnUrl, 'image-manager', path);
    });
}

module.exports = helper;
