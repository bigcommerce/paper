var _ = require('lodash');

module.exports = function (paper) {

    paper.handlebars.registerHelper('pluck', function(collection, path) {
        return _.pluck(collection, path);
    });
};
