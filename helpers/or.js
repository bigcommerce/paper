var _ = require('lodash'),
    internals = {};

/**
 * Yield block if any object within a collection matches supplied predicate
 *
 * @example
 * {{#or 1 0 0 0 0 0}} ... {{/or}}
 */

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function() {
    this.handlebars.registerHelper('or', function() {
        var args = [],
        opts,
        any;

        // Translate arguments to array safely
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        // Take the last argument (content) out of testing array
        opts = args.pop();

        // Without options hash, we check all the arguments
        any = _.any(args, function(arg) {
            if (_.isArray(arg)) {
                return !!arg.length;
            }
            // If an empty object is passed, arg is false
            else if (_.isEmpty(arg) && _.isObject(arg)) {
                return false;
            }
            // Everything else
            else {
                return !!arg;
            }
        });

        if (any) {
            return opts.fn(this);
        }

        return opts.inverse(this);
    });
};

module.exports = internals.implementation;
