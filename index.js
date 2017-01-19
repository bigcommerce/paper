'use strict';

var _ = require('lodash');
var localizer = require('./lib/localizer');
var Path = require('path');
var Fs = require('fs');
var Handlebars = require('handlebars');
var Async = require('async');
var helpers = [];
var handlebarsOptions = {
    preventIndent: true
};

// Load helpers (this only run once)
Fs.readdirSync(Path.join(__dirname, 'helpers')).forEach(function (file) {
    helpers.push(require('./helpers/' + file));
});

/**
* Theme renderer constructor
* @param {Object} settings
* @param {Object} themeSettings
* @param {Object} assembler
*/
function Paper(settings, themeSettings, assembler) {
    var self = this;

    self.handlebars = Handlebars.create();

    self.handlebars.templates = {};
    self.translate = null;
    self.inject = {};
    self.decorators = [];

    self.settings = settings || {};
    self.themeSettings = themeSettings || {};
    self.assembler = assembler || {};

    _.each(helpers, function (helper) {
        helper(self);
    });
}

/**
 * Renders a string with the given context
 * @param  {String} string
 * @param  {Object} context
 */
Paper.prototype.renderString = function (string, context) {
    return this.handlebars.compile(string)(context);
};

Paper.prototype.loadTheme = function (paths, acceptLanguage, done) {
    var self = this;

    if (!_.isArray(paths)) {
        paths = paths ? [paths] : [];
    }

    Async.parallel([
        function (next) {
            self.loadTranslations(acceptLanguage, next);
        },
        function (next) {
            Async.map(paths, self.loadTemplates.bind(self), next);
        }
    ], done);
};

/**
 * Load Partials/Templates
 * @param  {Object}   templates
 * @param  {Function} callback
 */
Paper.prototype.loadTemplates = function (path, callback) {
    var self = this;

    var processor = self.getTemplateProcessor();

    self.assembler.getTemplates(path, processor, function (error, templates) {
        if (error) {
            return callback(error);
        }

        _.each(templates, function (precompiled, path) {
            var template;
            if (!self.handlebars.templates[path]) {
                eval('template = ' + precompiled);
                self.handlebars.templates[path] = self.handlebars.template(template);
            }
        });

        self.handlebars.partials = self.handlebars.templates;

        callback();
    });
};

Paper.prototype.getTemplateProcessor = function () {
    var self = this;

    return function (templates) {
        var precompiledTemplates = {};

        _.each(templates, function (content, path) {
            precompiledTemplates[path] = self.handlebars.precompile(content, handlebarsOptions);
        });

        return precompiledTemplates;
    }
};

/**
 * Load Partials/Templates used for test cases and stencil-cli
 * @param  {Object}   templates
 * @return {Object}
 */
Paper.prototype.loadTemplatesSync = function (templates) {
    var self = this;

    _.each(templates, function (content, fileName) {
        self.handlebars.templates[fileName] = self.handlebars.compile(content, handlebarsOptions);
    });

    self.handlebars.partials = self.handlebars.templates;

    return self;
};

/**
 * @param {String} acceptLanguage
 * @param {Object} translations
 */
Paper.prototype.loadTranslations = function (acceptLanguage, callback) {
    var self = this;

    self.assembler.getTranslations((error, translations) => {
        if (error) {
            return callback(error);
        }
        // Make translations available to the helpers
        self.translate = localizer(acceptLanguage, translations);

        callback();
    });
};

/**
 * Add CDN base url to the relative path
 * @param  {String} path     Relative path
 * @return {String}          Url cdn
 */
Paper.prototype.cdnify = function (path) {
    var cdnUrl = this.settings['cdn_url'] || '';
    var versionId = this.settings['theme_version_id'];
    var configId = this.settings['theme_config_id'];
    var sessionId = this.settings['theme_session_id'];
    var protocolMatch = /(.*!?:)/;

    if (path instanceof Handlebars.SafeString) {
        path = path.string;
    }

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

        if (this.themeSettings.cdn) {
            var endpointKey = match[0].substr(0, match[0].length - 1);
            if (this.themeSettings.cdn.hasOwnProperty(endpointKey)) {
                if (cdnUrl) {
                    return [this.themeSettings.cdn[endpointKey], path].join('/');
                }

                return ['/assets/cdn', endpointKey, path].join('/');
            }
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

    if (sessionId) {
        return [cdnUrl, 'stencil', versionId, configId, 'e', sessionId, path].join('/');
    }

    return [cdnUrl, 'stencil', versionId, configId, path].join('/');
};

/**
 * @param {Function} decorator
 */
Paper.prototype.addDecorator = function (decorator) {
    this.decorators.push(decorator);
};

/**
 * @param {String} path
 * @param {Object} context
 * @return {String}
 */
Paper.prototype.render = function (path, context) {
    var output;

    context = context || {};
    context.template = path;

    if (this.translate) {
        context.locale_name = this.translate.localeName;
    }

    output = this.handlebars.templates[path](context);

    _.each(this.decorators, function (decorator) {
        output = decorator(output);
    });

    return output;
};

/**
 * Theme rendering logic
 * @param  {String|Array} templatePath
 * @param  {Object} data
 * @return {String|Object}
 */
Paper.prototype.renderTheme = function(templatePath, data) {
    var html,
        output;

    // Is an ajax request?
    if (data.remote || _.isArray(templatePath)) {

        if (data.remote) {
            data.context = _.extend({}, data.context, data.remote_data);
        }

        // Is render_with ajax request?
        if (templatePath) {
            // if multiple render_with
            if (_.isArray(templatePath)) {
                // if templatePath is an array ( multiple templates using render_with option)
                // compile all the template required files into a hash table
                html = templatePath.reduce((table, file) => {
                    table[file] = this.render(file, data.context);
                    return table;
                }, {});
            } else {
                html = this.render(templatePath, data.context);
            }

            if (data.remote) {
                // combine the context & rendered html
                output = {
                    data: data.remote_data,
                    content: html
                };
            } else {
                output = html;
            }
        } else {
            output = {
                data: data.remote_data
            };
        }
    } else {
        output = this.render(templatePath, data.context);
    }

    return output;
}

module.exports = Paper;
