'use strict';
const SafeString = require('handlebars').SafeString;
const utils = require('handlebars-utils');

function helper(paper) {
    paper.handlebars.registerHelper('stripQuerystring', function(url) {
        if (url instanceof SafeString) {
            url = url.toString();
        }
        if (utils.isString(url)) {
            return url.split('?')[0];
        }
    });
}

module.exports = helper;
