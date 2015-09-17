var _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('for', function(from, to, context, options) {
        var output = '',
            maxIterations = 100;

        function isOptions(obj) {
            return _.isObject(obj) && obj.fn;
        }

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

        if (to <= from) {
            return;
        }

        from = parseInt(from, 10);
        to = parseInt(to, 10);

        if ((to - from) >= maxIterations) {
            to = from + maxIterations - 1;
        }

        for (var i = from; i <= to; i++) {
            context.$index = i;
            output += options.fn(context);
        }

        return output;
    });
};

module.exports = internals.implementation;
