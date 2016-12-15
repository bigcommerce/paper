'use strict';

/**
 * @module paper/lib/translator
 */

const _ = require('lodash');
const LangParser = require('accept-language-parser');
const MessageFormat = require('messageformat');
const Filter = require('./filter');
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
 * @param {string} localeName
 * @param {Object} translations
 * @param {MessageFormat} formatter
 */
function Translator(localeName, translations, formatter) {
    /**
     * @private
     * @type {string}
     */
    this._localeName = localeName;

    /**
     * @private
     * @type {Object.<string, string>}
     */
    this._translation = translations[localeName] || {};

    /**
     * @private
     * @type {MessageFormat}
     */
    this._formatter = formatter;

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
 * @param {Object} locales
 * @returns {Translator}
 */
Translator.create = function (acceptLanguage, locales) {
    const translations = Transformer.transform(locales, DEFAULT_LOCALE);
    let localeName = getPreferredLocale(acceptLanguage, translations);
    let formatter;

    try {
        formatter = createFormatter(localeName);
    } catch (e) {
        localeName = DEFAULT_LOCALE;
        formatter = createFormatter(localeName);
    }

    return new Translator(localeName, translations, formatter);
};

/**
 * Get translated string
 * @param {string} key
 * @param {Object} parameters
 * @returns {string}
 */
Translator.prototype.translate = function (key, parameters) {
    const translation = this.getTranslation();

    if (!translation[key]) {
        return key;
    }

    if (!_.isFunction(this._formatFunctions[key])) {
        try {
            this._formatFunctions[key] = this._formatter.compile(translation[key]);
        } catch (err) {
            if (err.name === 'SyntaxError') {
                Logger.logError(`Language File Syntax Error: ${err.message} for key "${key}"`, err.expected);

                return '';
            }

            throw err;
        }
    }

    try {
        return this._formatFunctions[key](parameters);
    } catch (err) {
        Logger.log(err);

        return '';
    }
};

/**
 * Get locale name
 * @returns {string} Translation locale
 */
Translator.prototype.getLocaleName = function () {
    return this._localeName;
};

/**
 * Get translation object
 * @param {string} [keyFilter]
 * @returns {Object} Translation object
 */
Translator.prototype.getTranslation = function (keyFilter) {
    if (keyFilter) {
        return Filter.filterByKey(this._translation, keyFilter);
    }

    return this._translation;
};

/**
 * Get messager formatter
 * @private
 * @param {string} localeName
 * @returns {MessageFormat}
 */
function createFormatter(localeName) {
    const localeCode = localeName.split('-')[0];

    return new MessageFormat(localeCode);
};

/**
 * Get preferred locale
 * @private
 * @param {string} acceptLanguage
 * @param {Object} translations
 * @returns {string}
 */
function getPreferredLocale(acceptLanguage, translations) {
    const langs = LangParser.parse(acceptLanguage);
    let preferredLocale = DEFAULT_LOCALE;

    _.each(langs, lang => {
        const langKey = _.isString(lang.region) ? `${lang.code}-${lang.region}` : lang.code;

        if (translations[langKey]) {
            preferredLocale = langKey;

            return false;
        }
    });

    return preferredLocale;
};

module.exports = Translator;
