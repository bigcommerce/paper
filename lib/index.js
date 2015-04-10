var _ = require('lodash'),
    Handlebars = require('handlebars'),
    internals = {};

/**
 * Registers all the resolved partials
 *
 * @param {Object} loadedTemplates
 */
internals.registerPartials = function(loadedTemplates) {
    _.forOwn(loadedTemplates, function(content, fileName) {
        Handlebars.registerPartial(fileName, content);
    });
};

/**
 * Load up common handlebars helper methods
 */
internals.loadHelpers = function () {
    Handlebars.registerHelper('block', function (name, options) {
        /* Look for partial by name. */
        var partial = Handlebars.partials[name] || options.fn;
        return partial(this, {data: options.hash});
    });

    Handlebars.registerHelper('partial', function (name, options) {
        Handlebars.registerPartial(name, options.fn);
    });

    Handlebars.registerHelper('scripts', function (name, options) {
        return 'load scripts for ' + name + ' here';
    });
};

/**
 * Wrapper for the handlebars compile function
 *
 * @param {String} mainTemplate
 * @param {Object} source
 * @param {Object} context
 * @return {Object}
 */
exports.compile = function(mainTemplate, source, context) {
    var template,
        compiled = {
            err: undefined,
            template: ''
        };

    internals.loadHelpers();
    internals.registerPartials(source);

    try {
        template = Handlebars.compile(source[mainTemplate]);
        compiled.template = template(context);
    } catch (ex) {
        compiled.err = ex.message;
    }

    return compiled;
};
