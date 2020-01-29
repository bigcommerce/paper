'use strict';
const he = require('he');
const utils = require('handlebars-utils');
const common = require('./../lib/common');
const SafeString = require('handlebars').SafeString;

function helper(paper) {
    paper.handlebars.registerHelper('encodeHtmlEntities', function(string) {
        string = common.unwrapIfSafeString(string);
        if (!utils.isString(string)){
            throw new TypeError("Non-string passed to encodeHtmlEntities");
        }

        return new SafeString(he.encode(string));
    });
}

module.exports = helper;
