'use strict';

var _ = require('lodash');

function helper(paper) {
    paper.handlebars.registerHelper('stylesheet', function (assetPath) {
        const options = arguments[arguments.length - 1];
        const url = paper.cdnify(assetPath);
        var attrs = {
            rel: 'stylesheet'
        };

        // check if there is any extra attribute
        if (_.isObject(options.hash)) {
            attrs = _.merge(attrs, options.hash);
        }

        if (!attrs.id) {
            attrs.id = url;
        }

        attrs = _.map(attrs, function (value, key) {
            return key + '="' + value + '"';
        }).join(' ');


        return '<link data-stencil-stylesheet href="' + url + '" ' + attrs + '>';
    });
}

module.exports = helper;
