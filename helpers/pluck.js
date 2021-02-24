'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('pluck', function (collection, path) {
        return collection.map(item => item[path])
    });
}

module.exports = helper;
