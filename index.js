var _ = require('lodash'),
    Localizer = require('./lib/localizer'),
    Path = require('path'),
    Fs = require('fs'),
    internals = {
        handlebars: require('handlebars'),
        options: {
            preventIndent: true
        }
    };

Fs.readdirSync(Path.join(__dirname, 'helpers')).forEach(function(file) {
  require('./helpers/' + file)(internals);
});

/**
 * Paper constructor
 * @param {object} templates
 * @param {object} translations
 */
function Paper(templates, translations) {

    _.forOwn(templates, function (content, fileName) {
        internals.handlebars.registerPartial(fileName, content);
    });

    // make transalations available to the helpers
    internals.translations = translations;

    // Clean the inject context
    internals.inject = {};

    this.compile = function (path, context) {
        var template = internals.handlebars.compile(templates[path], internals.options),
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
    
    var paper = new Paper(templates, translations);

    return paper.compile(path, context);
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
