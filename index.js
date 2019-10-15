'use strict';

const _ = require('lodash');
const Translator = require('./lib/translator');
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
* Assembler.getTemplates assembles all the templates required to render the given
* top-level template.
*
* @callback assemblerGetTemplates
* @param {string} path - The path to the templates, relative to the templates directory
* @param {processor} processor - An optional processor to apply to each template during assembly
* @return {Promise} A promise to return the (optionally processed) templates
*/

/**
* Assembler.getTranslations assembles all the translations for the theme.
*
* @callback assemblerGetTranslations
* @return {Promise} A promise to return the translations
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
    * @param {assemblerGetTemplates} assembler.getTemplates - Method to assemble templates
    * @param {assemblerGetTranslations} assembler.getTranslations - Method to assemble translations
    * @param {String} rendererType - One of ['handlebars-v3', 'handlebars-v4']
    * @param {Object} logger - a console-like logger object
    */
    constructor(siteSettings, themeSettings, assembler, rendererType, logger = console) {
        this._assembler = assembler || {};

        // Build renderer based on type
        switch(rendererType) {
        case 'handlebars-v4':
            this.renderer = new HandlebarsRenderer(siteSettings, themeSettings, 'v4', logger);
            break;
        case 'handlebars-v3':
        default:
            this.renderer = new HandlebarsRenderer(siteSettings, themeSettings, 'v3', logger);
            break;
        }

        this.preProcessor = this.renderer.getPreProcessor();

        this.logger = logger;
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
     * @return {Promise} Promise to load the templates and translations into the renderer.
    */
    loadTheme(paths, acceptLanguage) {
        if (!_.isArray(paths)) {
            paths = paths ? [paths] : [];
        }

        const promises = [];
        promises.push(this.loadTranslations(acceptLanguage));
        paths.forEach(path => {
            promises.push(this.loadTemplates(path));
        });

        return Promise.all(promises);
    }

    /**
     * Use the assembler to fetch partials/templates, then load them
     * into the renderer.
     *
     * @param {String} path The root template path to load. All dependencies will be loaded as well.
     * @return {Promise} Promise to load the templates into the renderer.
    */
    loadTemplates(path) {
        return this._assembler.getTemplates(path, this.preProcessor).then(templates => {
            return this.renderer.addTemplates(templates);
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
     * @return {Promise} Promise to load the translations into the renderer.
     */
    loadTranslations(acceptLanguage) {
        return this._assembler.getTranslations().then(translations => {
            const translator = Translator.create(acceptLanguage, translations, this.logger);
            this.renderer.setTranslator(translator);
            return translations;
        });
    };

    /**
     * Render a string with the given context.
     *
     * @param  {String} string
     * @param  {Object} context
     * @return {Promise} A promise to return the rendered text
     * @throws [CompileError|RenderError]
     */
    renderString(string, context) {
        return this.renderer.renderString(string, context);
    }

    /**
     * Renders a template with the given context
     *
     * @param {String} path The path to the template
     * @param {Object} context The context to provide to the template
     * @return {Promise} A promise to return the rendered template
     * @throws [TemplateNotFoundError|RenderError|DecoratorError]
     */
    render(path, context) {
        return this.renderer.render(path, context);
    }

    /**
     * Theme rendering logic. This is used by Stencil CLI.
     *
     * @param  {String|Array} templatePath A single template or list of templates to render.
     * @param  {Object} data
     * @return {Promise} A promise that returns a {String|Object} depending on whether multiple templates were rendered
     * @throws [TemplateNotFoundError|RenderError|DecoratorError]
     */
    renderTheme(templatePath, data) {
        // Simple case of a single non-ajax template
        if (!data.remote && !_.isArray(templatePath)) {
            return this.render(templatePath, data.context);
        }

        // If no template path provided, just return the remote data
        if (!templatePath) {
            return Promise.resolve({ data: data.remote_data });
        }

        // If ajax request, merge remote_data into context
        if (data.remote) {
            data.context = Object.assign({}, data.context, data.remote_data);
        }

        const renderPromises = [];
        let result;

        if (_.isArray(templatePath)) {
            // If templatePath is an array (multiple templates using render_with option),
            // compile all the template required files into an object
            result = {};
            for (let i = 0; i < templatePath.length; i++) {
                const path = templatePath[i];
                renderPromises.push(this.render(path, data.context).then(html => {
                    result[path] = html;
                }));
            }
        } else {
            renderPromises.push(this.render(templatePath, data.context).then(html => {
                result = html;
            }));
        }

        return Promise.all(renderPromises).then(() => {
            // Remote requests get both the remote data & rendered html
            if (data.remote) {
                result = {
                    data: data.remote_data,
                    content: result
                };
            }

            return result;
        });
    }
}

module.exports = Paper;
