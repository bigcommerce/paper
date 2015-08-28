var _ = require('lodash'),
    Localizer = require('./lib/localizer'),
    Path = require('path'),
    Fs = require('fs'),
    Handlebars = require('handlebars'),
    internals = {
        options: {
            preventIndent: true
        }
    },
    helpers = [];

// Load Helpers
Fs.readdirSync(Path.join(__dirname, 'helpers')).forEach(function(file) {
    var helper = require('./helpers/' + file);
    helpers.push(helper);
});

/**
 * Paper constructor
 * @param {object} templates
 * @param {object} translations
 */
function Paper(templates, translations, context) {

    var handlebars = Handlebars.create();

    // Make translations available to the helpers
    internals.translations = translations;

    // Clean the inject context
    internals.inject = {};

    _.each(helpers, function(Helper) {
        var helper = new Helper(handlebars);
        helper.register(context, internals);
    });

    // Register Partials
    _.forOwn(templates, function (content, fileName) {
        handlebars.registerPartial(fileName, content);
    });

    this.compile = function (path) {
        var template = handlebars.compile(templates[path], internals.options),
            content = template(context);

        return content;
    };
}

/**
 * Wrapper for the handlebars compile function
 * This is the async version
 *
 * @param {String} path
 * @param {Object} templates
 * @param {Object} context
 * @param {Object} translations
 * @return {Object}
 */
exports.compile = function (path, templates, context, translations) {

    var paper = new Paper(templates, translations, context);

    return paper.compile(path);
};

/**
 * Compiles translation JSON files with messageformat.js
 * @param rootLocale
 * @param translations
 * @returns {*}
 */
exports.compileTranslations = function (rootLocale, translations) {
    return Localizer.compileTranslations(rootLocale, translations);
};
