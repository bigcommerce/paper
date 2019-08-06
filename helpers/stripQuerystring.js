'use strict';
const utils = require('handlebars-utils');
const common = require('../lib/common.js');

function helper(paper) {
    paper.handlebars.registerHelper('stripQuerystring', function(url) {
        url = common.unwrapIfSafeString(url);
        if (utils.isString(url)) {
            return url.split('?')[0];
        }
    });
}

module.exports = helper;
