'use strict';
const { getObjectStorageImage } = require('../lib/getObjectStorageImage')

function helper(paper) {
    paper.handlebars.registerHelper('getContentImage', function(path) {
        const cdnUrl = paper.settings['cdn_url'] || '';

        const options = arguments[arguments.length - 1];

        return getObjectStorageImage(cdnUrl, 'content', path, options);
    });
}

module.exports = helper;
