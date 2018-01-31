'use strict';

const _ = require('lodash');
const Translator = require('./lib/translator');
const Async = require('async');
const HandlebarsRenderer = require('@bigcommerce/stencil-paper-handlebars');

/**
* processor is an optional function to apply during template assembly. The
* templates parameter is a object where the keys are paths and the values are the
* raw templates. The function returns an object of the same format, possibly changing
* the values. We use this to precompile templates within the Paper module.
*
* @callback processor
* @param {Object} templates - Object that contains the gathered templates
*/

/**
* getTemplatesCallback is a function to call on completion of Assembler.getTemplates
*
* @callback getTemplatesCallback
* @param {Error} err - Error if it occurred, null otherwise
* @param {Object} templates - Object that contains the gathered templates, including processing
*/

/**
* getTranslationsCallback is a function to call on completion of Assembler.getTranslations
*
* @callback getTranslationsCallback
* @param {Error} err - Error if it occurred, null otherwise
* @param {Object} translations - Object that contains the translations
*/

/**
* Assembler.getTemplates assembles all the templates required to render the given
* top-level template.
*
* @callback assemblerGetTemplates
* @param {string} path - The path to the templates, relative to the templates directory
* @param {processor} processor - An optional processor to apply to each template during assembly
* @param {getTemplatesCallback} callback - Callback when Assembler.getTemplates is done.
*/

/**
* Assembler.getTranslations assembles all the translations for the theme.
*
* @callback assemblerGetTranslations
* @param {getTranslationsCallback} callback - Callback when Assembler.getTranslations is done.
*/

class Paper {
    /**
    * Paper constructor. In addition to store settings and theme settings (configuration),
    * paper expects to be passed an assembler to gather all the templates required to render
    * the top level template.
    *
    * @param {Object} siteSettings - Site settings
    * @param {Object} themeSettings - Theme settings (configuration)
    * @param {Object} assembler - Assembler with getTemplates and getTranslations methods.
    * @param {String} rendererType - One of ['handlebars-v3', 'handlebars-v4']
    * @param {assemblerGetTemplates} assembler.getTemplates - Method to assemble templates
    * @param {assemblerGetTranslations} assembler.getTranslations - Method to assemble translations
    */
    constructor(siteSettings, themeSettings, assembler, rendererType) {
        this._assembler = assembler || {};

        // Build renderer based on type
        switch(rendererType) {
        case 'handlebars-v4':
            this.renderer = new HandlebarsRenderer(siteSettings, themeSettings, 'v4');
            break;
        case 'handlebars-v3':
        default:
            this.renderer = new HandlebarsRenderer(siteSettings, themeSettings, 'v3');
            break;
        }

        this.preProcessor = this.renderer.getPreProcessor();
    }

    /**
     * Get the siteSettings object containing global site settings.
     *
     * @return {object} settings An object containing global site settings.
     */
    getSiteSettings() {
        return this.renderer.getSiteSettings();
    };

    /**
     * Set the siteSettings object containing global site settings.
     *
     * @param {object} settings An object containing global site settings.
     */
    setSiteSettings(settings) {
        this.renderer.setSiteSettings(settings);
    };

    /**
     * Get the themeSettings object containing the theme configuration.
     *
     * @return {object} settings An object containing the theme configuration.
     */
    getThemeSettings() {
        return this.renderer.getThemeSettings();
    };

    /**
     * Set the themeSettings object containing the theme configuration.
     *
     * @param {object} settings An object containing the theme configuration.
     */
    setThemeSettings(settings) {
        this.renderer.setThemeSettings(settings);
    };

    /**
     * Reset decorator list.
     */
    resetDecorators() {
        this.renderer.resetDecorators();
    };

    /**
     * Add a decorator to wrap output during render().
     *
     * @param {Function} decorator
     */
    addDecorator(decorator) {
        this.renderer.addDecorator(decorator);
    };

    /**
     * Get page content.
     *
     * @return {Object} Regions with widgets
     */
    getContent() {
        return this.renderer.getContent();
    };

    /**
     * Add content to be rendered in the given regions.
     *
     * @param {Object} Regions with widgets
     */
    setContent(regions) {
        this.renderer.setContent(regions);
    };

    /**
     * Use the assembler to fetch partials/templates, and translations, then load them
     * into the renderer.
     *
     * @param {String|Array} paths A string or array of strings - the template path(s) to load.
     * @param {String} acceptLanguage The accept-language header - used to select a locale.
     * @param {Function} callback
    */
    loadTheme(paths, acceptLanguage, callback) {
        if (!_.isArray(paths)) {
            paths = paths ? [paths] : [];
        }

        Async.parallel([
            next => {
                this.loadTranslations(acceptLanguage, next);
            },
            next => {
                Async.map(paths, this.loadTemplates.bind(this), next);
            }
        ], callback);
    }

    /**
     * Use the assembler to fetch partials/templates, then load them
     * into the renderer.
     *
     * @param {String} path The root template path to load. All dependencies will be loaded as well.
     * @param {Function} callback
    */
    loadTemplates(path, callback) {
        this._assembler.getTemplates(path, this.preProcessor, (err, templates) => {
            if (err) {
                return callback(err);
            }

            try {
                this.renderer.addTemplates(templates);
            } catch(ex) {
                return callback(ex);
            }

            callback();
        });
    }

    /**
     * Is the given template loaded?
     *
     * @param {String} path The path to the template file
     * @return {Boolean} is the given template loaded?
     */
    isTemplateLoaded(path) {
        return this.renderer.isTemplateLoaded(path);
    }

    /**
     * Load translation files and give a translator to renderer.
     *
     * @param {String} acceptLanguage The accept-language header, used to select a locale
     * @param {Function} callback
     */
    loadTranslations(acceptLanguage, callback) {
        // Ask assembler to fetch translations file
        this._assembler.getTranslations((err, translations) => {
            if (err) {
                return callback(err);
            }

            // Make translations available to renderer
            const translator = Translator.create(acceptLanguage, translations);
            this.renderer.setTranslator(translator);
            callback();
        });
    };

    /**
     * Render a string with the given context.
     *
     * @param  {String} string
     * @param  {Object} context
     * @return {String}
     * @throws [CompileError|RenderError]
     */
    renderString(string, context) {
        return this.renderer.renderString(string, context);
    }

    /**
     * Renders a template with the given context
     *
     * @param {String} path
     * @param {Object} context
     * @return {String}
     * @throws [TemplateNotFoundError|RenderError|DecoratorError]
     */
    render(path, context) {
        return this.renderer.render(path, context);
    }

    /**
     * Theme rendering logic
     *
     * @param  {String|Array} templatePath
     * @param  {Object} data
     * @return {String|Object}
     * @throws [TemplateNotFoundError|RenderError|DecoratorError]
     */
    renderTheme(templatePath, data) {
        let html;
        let output;

        // Is an ajax request?
        if (data.remote || _.isArray(templatePath)) {

            if (data.remote) {
                data.context = Object.assign({}, data.context, data.remote_data);
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
}

module.exports = Paper;
