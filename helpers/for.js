var _ = require('lodash');

function isOptions(obj) {
    return _.isObject(obj) && obj.fn;
}

module.exports = function (paper) {
    paper.handlebars.registerHelper('for', function(from, to, context, options) {
        var output = '',
            maxIterations = 100;

        if (isOptions(to)) {
            options = to;
            context = {};
            to = from;
            from = 1;

        } else if (isOptions(context)) {
            options = context;

            if (_.isObject(to)) {
                context = to;
                to = from;
                from = 1;
            }
        }

        if ((to - from) >= maxIterations) {
            to = from + maxIterations - 1;
        }

        for (var i = from; i < to + 1; i += 1) {
            context.$index = i;
            // console.log(context);
            output += options.fn(context);
        }

        return output;
    });
};
