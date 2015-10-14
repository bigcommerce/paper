var _ = require('lodash'),
    Localizer = require('./lib/localizer'),
    Path = require('path'),
    Fs = require('fs'),
    Handlebars = require('handlebars'),
    Async = require('async'),
    internals = {
        options: {
            preventIndent: true
        }
    },
    Helpers = [];

// Load Helpers
Fs.readdirSync(Path.join(__dirname, 'helpers')).forEach(function(file) {
    Helpers.push(require('./helpers/' + file));
});

/**
 * Theme renderer constructor
 * @param {Object} assembler
 */
module.exports = function (assembler) {
    var self = this;

    self.handlebars = Handlebars.create();

    self.handlebars.templates = {};

    self.options = internals.options;
    self.translate = null;
    self.inject = {};
    self.helpers = [];
    self.decorators = [];

    _.each(Helpers, function(Helper) {
        self.helpers.push(new Helper(self.handlebars));
    });

    self.loadTheme = function (paths, acceptLanguage, done) {
        if (!_.isArray(paths)) {
            paths = paths ? [paths] : [];
        }

        Async.parallel([
            function (next) {
                self.loadTranslations(acceptLanguage, next);
            },
            function (next) {
                Async.map(paths, self.loadTemplates, next);
            }
        ], done);
    };

    /**
     * Load Partials/Templates 
     * @param  {Object}   templates
     * @param  {Function} callback
     */
    self.loadTemplates = function(path, callback) {
        var processor = self.getTemplateProcessor();

        assembler.getTemplates(path, processor, function(error, templates) {
            if (error) {
                return callback(error);
            }

            _.each(templates, function (precompiled, path) {

                if (!self.handlebars.templates[path]) {
                    eval('var template = ' + precompiled);
                    self.handlebars.templates[path] = self.handlebars.template(template);
                }
            });

            callback();
        });
    };

    self.getTemplateProcessor = function() {
        return function (templates) {
            var precompiledTemplates = {};

            _.each(templates, function (content, path) {
                precompiledTemplates[path] = self.handlebars.precompile(content, self.options);
            });

            return precompiledTemplates;
        }
    };

    /**
     * Load Partials/Templates used for test cases and stencil-cli
     * @param  {Object}   templates
     * @return {Object}
     */
    self.loadTemplatesSync = function(templates) {
        _.each(templates, function (content, fileName) {          
            self.handlebars.templates[fileName] = self.handlebars.compile(content, self.options);
        });

        return self;
    };

    /**
     * @param {String} acceptLanguage
     * @param {Object} translations
     */
    self.loadTranslations = function (acceptLanguage, callback) {

        assembler.getTranslations(function (error, translations) {
            if (error) {
                return callback(error);
            }
            // Make translations available to the helpers
            self.translate =  Localizer(acceptLanguage, translations);

            callback();
        });
    };

    /**
     * @param {Function} decorator
     */
    self.addDecorator = function (decorator) {
        self.decorators.push(decorator);
    }

    /**
     * @param {String} path
     * @param {Object} context
     * @return {String}
     */
    self.render = function (path, context) {
        var output;

        _.each(self.helpers, function(helper) {
            helper.register(context, self);
        });

        self.handlebars.partials = self.handlebars.templates;

        output = self.handlebars.templates[path](context);

        _.each(self.decorators, function (decorator) {
            output = decorator(output);
        });

        return output;
    };
}
