'use strict';

var _ = require('lodash');

function helper(paper) {
    paper.handlebars.registerHelper('pluck', function (collection, path) {
        return _.map(collection, path);
    });
}

module.exports = helper;
