'use strict';
const URL = require('url').URL;
const utils = require('handlebars-utils');
const common = require('./../lib/common');
const SafeString = require('handlebars').SafeString;

function helper(paper) {
    paper.handlebars.registerHelper('setURLQueryParam', function(string, key, value) {
        string = common.unwrapIfSafeString(string);
        key = common.unwrapIfSafeString(key);
        value = common.unwrapIfSafeString(value);
        if (!utils.isString(string) || !common.isValidURL(string)){
            throw new TypeError("Invalid URL passed to setURLQueryParam");
        } else if (!utils.isString(key)){
            throw new TypeError("Invalid query parameter key passed to setURLQueryParam");
        } else if(!utils.isString(value)) {
            throw new TypeError("Invalid query parameter value passed to setURLQueryParam");
        }

        const url = new URL(string);

        url.searchParams.set(encodeURIComponent(key), encodeURIComponent(value));

        return new SafeString(url.toString());
    });
}

module.exports = helper;
