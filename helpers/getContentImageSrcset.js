'use strict';
const { getObjectStorageImageSrcset } = require('../lib/getObjectStorageImage')

function helper(paper) {
    paper.handlebars.registerHelper('getContentImageSrcset', function(path) {
        const cdnUrl = paper.settings['cdn_url'] || '';

        return getObjectStorageImageSrcset(cdnUrl, 'content', path);
    });
}

module.exports = helper;
