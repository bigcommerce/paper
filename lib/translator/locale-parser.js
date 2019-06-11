'use strict';

/**
 * @module paper/lib/translator/locale-parser
 */

const AcceptLanguageParser = require('accept-language-parser');
const MessageFormat = require('messageformat');

/**
 * Get preferred locale
 * @param {string} acceptLanguage
 * @param {Object} languages
 * @returns {string}
 */
function getPreferredLocale(acceptLanguage, languages, defaultLocale) {
    const locales = getLocales(acceptLanguage);
    let preferredLocale = defaultLocale;

    for (let i = 0; i < locales.length; i++) {
        if (languages[locales[i]]) {
            preferredLocale = locales[i];
            break;
        }
    }
    return normalizeLocale(preferredLocale, defaultLocale);
}

/**
 * Parse locale header
 * @param {string} acceptLanguage
 * @returns {string[]} Locales
 */
function getLocales(acceptLanguage) {
    const localeObjects = AcceptLanguageParser.parse(acceptLanguage);
    const localeArr = [];

    for (let i = 0; i < localeObjects.length; i++) {
        const localeObjectData = typeof localeObjects[i].region === 'string'  ? `${localeObjects[i].code}-${localeObjects[i].region}` : localeObjects[i].code;
        localeArr.push(localeObjectData);
    }
    return localeArr;
}

/**
 * Normalize locale
 * @private
 * @param {string} locale
 * @returns {string}
 */
function normalizeLocale(locale, defaultLocale) {
    try {
        new MessageFormat(locale);

        return locale;
    } catch (err) {
        return defaultLocale;
    }
}

module.exports = {
    getPreferredLocale: getPreferredLocale,
    getLocales: getLocales,
};
