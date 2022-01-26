'use strict';

/**
 * @module paper/lib/translator
 */

const MessageFormat = require('messageformat');
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
function Translator(acceptLanguage, allTranslations, logger = console) {
    this.logger = logger;

    const locales = LocaleParser.getLocales(acceptLanguage);
    const languages = Transformer.transform(allTranslations, locales, DEFAULT_LOCALE, this.logger);

    /**
     * @private
     * @type {string}
     */
    this._locale = LocaleParser.getPreferredLocale(locales, languages, DEFAULT_LOCALE);

    /**
     * @private
     * @type {Object.<string, string>}
     */
    this._language = languages[this._locale] || {};

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
 * @returns {Translator}
 */
Translator.create = function (acceptLanguage, allTranslations, logger = console) {
    return new Translator(acceptLanguage, allTranslations, logger);
};


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

    if (typeof this._formatFunctions[key] === 'undefined') {
        this._formatFunctions[key] = this._compileTemplate(key);
    }

    try {
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
