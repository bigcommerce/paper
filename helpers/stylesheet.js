'use strict';

const isObject = require("../lib/utils/isObject");

function helper(paper) {
    paper.handlebars.registerHelper('stylesheet', function (assetPath) {
        const options = arguments[arguments.length - 1];
        const configId = paper.settings['theme_config_id'];
        // append the configId only if the asset path starts with assets/css/
        const path = configId && assetPath.match(/^\/?assets\/css\//)
            ? assetPath.replace(/\.css$/, `-${configId}.css`)
            : assetPath;

        const url = paper.cdnify(path);

        let attrsObj = { rel: 'stylesheet' };

        // check if there is any extra attribute
        if (isObject(options.hash)) {
            attrsObj = { ...attrsObj, ...options.hash };
        }

        const attrsString = Object.entries(attrsObj)
            .map(([key, value]) => `${key}="${value}"`)
            .join( ' ');

        return `<link data-stencil-stylesheet href="${url}" ${attrsString}>`;
    });
}

module.exports = helper;
