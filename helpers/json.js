'use strict';
const common = require('../lib/common.js');

function helper(paper) {
    paper.handlebars.registerHelper('json', function (data) {
        data = common.unwrapIfSafeString(data);
        return JSON.stringify(data);
    });
}

module.exports = helper;
