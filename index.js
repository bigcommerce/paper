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
Fs.readdirSync(Path.join(__dirname, 'helpers')).forEach(function (file) {
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

    _.each(Helpers, function (Helper) {
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
    self.loadTemplates = function (path, callback) {
        var processor = self.getTemplateProcessor();

        assembler.getTemplates(path, processor, function (error, templates) {
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

    self.getTemplateProcessor = function () {
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
    self.loadTemplatesSync = function (templates) {
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
            self.translate = Localizer(acceptLanguage, translations);

            callback();
        });
    };

    /**
     * Add CDN base url to the relative path
     * @param  {String} path     Relative path
     * @param  {Object} settings Theme settings
     * @return {String}          Url cdn
     */
    self.cdnify = function (path, settings) {
        var cdnUrl = settings['cdn_url'] || '';
        var versionId = settings['theme_version_id'];
        var configId = settings['theme_config_id'];
        var protocolMatch = /(.*!?:)/;

        if (!path) {
            return '';
        }

        if (/^(?:https?:)?\/\//.test(path)) {
            return path;
        }

        if (protocolMatch.test(path)) {
            var match = path.match(protocolMatch);
            path = path.slice(match[0].length, path.length);

            if (path[0] === '/') {
                path = path.slice(1, path.length);
            }

            if (match[0] === 'webdav:') {
                return [cdnUrl, 'content', path].join('/');
            }

            if (path[0] !== '/') {
                path = '/' + path;
            }

            return path;
        }

        if (path[0] !== '/') {
            path = '/' + path;
        }

        if (!versionId || !configId) {
            return path;
        }

        if (path.substr(0, 8) === '/assets/') {
            path = path.substr(8, path.length);
        }

        return [cdnUrl, 'stencil', versionId, configId, path].join('/');
    };

    /**
     * @param {Function} decorator
     */
    self.addDecorator = function (decorator) {
        self.decorators.push(decorator);
    };

    /**
     * @param {String} path
     * @param {Object} context
     * @return {String}
     */
    self.render = function (path, context) {
        var output;

        _.each(self.helpers, function (helper) {
            helper.register(context, self);
        });

        self.handlebars.partials = self.handlebars.templates;

        output = self.handlebars.templates[path](context);

        _.each(self.decorators, function (decorator) {
            output = decorator(output);
        });

        return output;
    };
};
