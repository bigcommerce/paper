'use strict';

/**
 * @module paper/lib/translator
 */

const MessageFormat = require('messageformat');
const Filter = require('./filter');
const LocaleParser = require('./locale-parser');
const Logger = require('../logger');
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
 */
function Translator(acceptLanguage, allTranslations, logger = Logger) {
    this.logger = logger;

    const languages = Transformer.transform(allTranslations, DEFAULT_LOCALE, this.logger);

    /**
     * @private
     * @type {string}
     */
    this._locale = LocaleParser.getPreferredLocale(acceptLanguage, languages, DEFAULT_LOCALE);

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
 * @returns {Translator}
 * @param {Object} logger
 */
Translator.create = function (acceptLanguage, allTranslations, logger = Logger) {
    return new Translator(acceptLanguage, allTranslations, logger);
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

    if (!(this._formatFunctions[key] instanceof Function)) {
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
    this._formatters[locale] = this._formatters[locale] || new MessageFormat(locale);

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
        if (err.name === 'SyntaxError') {
            this.logger.error(`Language File Syntax Error: ${err.message} for key "${key}"`, err.expected);

            return () => '';
        }

        throw err;
    }
};

module.exports = Translator;
