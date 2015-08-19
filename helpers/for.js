var _ = require('lodash');

module.exports = function (paper) {
    paper.handlebars.registerHelper('for', function(from, to, context, options) {
        var output = '',
            maxIterations = 100;

        if (_.isObject(to)) {
            options = context;
            context = to;
            to = from;
            from = 1;
        }

        context = context || {};

        if (from < 0 || from > 1) {
            throw new Error("the parameter 'from' can only be 0 or 1");
        }
        
        // limit the number of iterations
        to = to > maxIterations
            ? maxIterations - 1
            : to;

        for (var i = from; i < to + 1; i += 1) {
            context.$index = i;
            output += options.fn(context);
        }

        return output;
    });
};
