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
 * @param {string} defaultLocale
 * @returns {string}
 */
function getPreferredLocale(acceptLanguage, languages, defaultLocale) {
    const locales = getLocales(acceptLanguage).find((locale) => languages[locale]) || defaultLocale;

    return normalizeLocale(locales, defaultLocale);
}

/**
 * Parse locale header
 * @param {string} acceptLanguage
 * @returns {string[]} Locales
 */
function getLocales(acceptLanguage) {
    const localeObjects = AcceptLanguageParser.parse(acceptLanguage);

    const locales = localeObjects.map(({ region, code }) => region ? `${code}-${region}` : code);

    //  Safari sends only one language code, this is to have a default fallback in case we don't have that language
    //  As an example we may not have fr-FR so add fr to the header
    if (locales.length === 1 && locales[0].split('-').length === 2) {
        locales.push(locales[0].split('-')[0]);
    }
    return locales;
}

/**
 * Normalize locale
 * @private
 * @param {string} locale
 * @param {string} defaultLocale
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
