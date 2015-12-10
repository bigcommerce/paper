var _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context, paper) {

    this.handlebars.registerHelper('snippet', function(location, options) {
        var template;
        var output = [];

        if (paper.snippets[location]) {

            _.each(paper.snippets[location], function(snippet) {
                template = paper.compile(snippet.snippets.join('\n'));

                // Preper the context for the snippet
                context.app = {};

                if (_.isObject(snippet.context)) {
                    context.app = snippet.context;
                }

                output.push(template(context));
            });
            
            return output.join('\n');
        }
    });
};

module.exports = internals.implementation;
