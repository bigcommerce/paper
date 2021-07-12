'use strict';

/**
 * @module paper/lib/translator
 */

const MessageFormat = require('@messageformat/core');
const { plural } = require('@messageformat/runtime');
const Filter = require('./filter');
const LocaleParser = require('./locale-parser');
const Transformer = require('./transformer');

/**
 * Default locale
 * @private
 * @type {string}
 */
const DEFAULT_LOCALE = 'en';

/**
 * Translator constructor
 * @constructor
 * @param {string} acceptLanguage
 * @param {Object} allTranslations
 * @param {Object} logger
 * @param {Boolean} omitTransforming
 */
function Translator(acceptLanguage, allTranslations, logger = console, omitTransforming = false) {
    this.logger = logger;
    this.omitTransforming = omitTransforming;

    const languages = this.omitTransforming ? allTranslations : Transformer.transform(allTranslations, DEFAULT_LOCALE, this.logger);
    /**
     * @private
     * @type {string}
     */
    this._locale = LocaleParser.getPreferredLocale(acceptLanguage, languages, DEFAULT_LOCALE);

    this.setLanguage(languages);

    /**
     * @private
     * @type {Object.<string, MessageFormat>}
     */
    this._formatters = {};

    /**
     * @private
     * @type {Object.<string, function>}
     */
    this._formatFunctions = {};
}

/**
 * Translator factory method
 * @static
 * @param {string} acceptLanguage
 * @param {Object} allTranslations
 * @param {Object} logger
 * @param {Boolean} omitTransforming
 * @returns {Translator}
 */
Translator.create = function (acceptLanguage, allTranslations, logger = console, omitTransforming = false) {
    return new Translator(acceptLanguage, allTranslations, logger, omitTransforming);
};

/**
 * Precompile translation functions
 * @param {Object} translations
 * @returns {Object}
 */
 Translator.precompileTranslations = function (translations) {
    const compiled = {};

    Object.keys(translations).forEach(language => {
        compiled[language] = {}
        Object.keys(translations[language]).forEach(categoryKey => {
            compiled[language][categoryKey] = translations[language][categoryKey];
            if (categoryKey === 'translations') {
                compiled[language].compiledTranslations = {};
                Object.keys(translations[language][categoryKey]).forEach(key => {
                    compiled[language].compiledTranslations[key] = Translator.compileFormatterFunction(translations[language], key);
                })
            }
        });
    });

    return compiled;
}

/**
 * Precompile translation functions
 * @param {Object} language
 * @param {String} key
 * @returns {Object}
 */
Translator.compileFormatterFunction = function (language, key) {
    const locale = language.locales[key];
    const formatter = new MessageFormat(locale);

    try {
        const value = typeof language.translations[key] === "string"
            ? language.translations[key]
            : language.translations[key].toString();
        return formatter.compile(value).toString();
    } catch (err) {
        console.error(`Error occured during Formatter function precompilation: ${err.message} for key "${key}"`);

        const value = language.translations[key] ? language.translations[key] : key;
        const fn = new Function(`return "${value}"`);
        return fn.toString();
    }
}

Translator.prototype.areFormatterFunctionsGlobal = function() {
    if (typeof global === "undefined") {
        return true;
    }

    return global.plural;
}

Translator.prototype.enableFormatterFunctionsGlobalScope = function() {
    global.plural = plural;
};

Translator.prototype.checkFormatterFunctionsAvailability = function() {
    if (!this.areFormatterFunctionsGlobal()) {
        this.enableFormatterFunctionsGlobalScope();
    }
};

/**
 * Get translated string
 * @param {string} key
 * @param {Object} parameters
 * @returns {string}
 */
Translator.prototype.translate = function (key, parameters) {
    const language = this.getLanguage();
    if (!language.translations || !language.translations[key]) {
        return key;
    }

    if (!this.omitTransforming && typeof this._formatFunctions[key] === 'undefined') {
        this._formatFunctions[key] = this._compileTemplate(key);
    }

    try {
        if (this.omitTransforming) {
            this.checkFormatterFunctionsAvailability();
            const fn = new Function(`return ${language.compiledTranslations[key]}`)()
            return fn(parameters);
        }
    
        return this._formatFunctions[key](parameters);
    } catch (err) {
        this.logger.error(err);

        return '';
    }
};

/**
 * Get locale name
 * @returns {string} Translation locale
 */
Translator.prototype.getLocale = function () {
    return this._locale;
};

/**
 * Get language object
 * @param {string} [keyFilter]
 * @returns {Object} Language object
 */
Translator.prototype.getLanguage = function (keyFilter) {
    if (keyFilter) {
        return Filter.filterByKey(this._language, keyFilter);
    }

    return this._language;
};

/**
 * Set language object
 * @param {Object} [languages] object
 */
Translator.prototype.setLanguage = function (languages) {
    this._language = languages[this._locale] || {};
};

/**
 * Get formatter
 * @private
 * @param {string} locale
 * @returns {MessageFormat} Return cached or new MessageFormat
 */
Translator.prototype._getFormatter = function (locale) {
    if (!this._formatters[locale]) {
        this._formatters[locale] = new MessageFormat(locale);
    }
   

    return this._formatters[locale];
};

/**
 * Compile a translation template and return a formatter function
 * @param {string} key
 * @return {Function}
 */
Translator.prototype._compileTemplate = function (key) {
    const language = this.getLanguage();
    const locale = language.locales[key];
    const formatter = this._getFormatter(locale);

    try {
        return formatter.compile(language.translations[key]);
    } catch (err) {
        this.logger.error(`Language File Syntax Error: ${err.message} for key "${key}"`, err.expected);

        return () => ''
    }
};

module.exports = Translator;
