'use strict';

/**
 * @module paper/lib/translator/locale-parser
 */
const AcceptLanguageParser = require('accept-language-parser');
const MessageFormat = require('messageformat');

/**
 * Parse the Accept-Language header and return the preferred locale after matching
 * up against the list of supported locales.
 *
 * @param {string} acceptLanguage The Accept-Language header
 * @param {Array} supportedLocales A list of supported locales
 * @param {string} defaultLocale The default fallback locale
 * @returns {string}
 */
function getPreferredLocale(acceptLanguage, supportedLocales, defaultLocale) {
    const requestedLocales = getLocales(acceptLanguage);
    const preferredLocale = requestedLocales.find(locale => supportedLocales.includes(locale)) || defaultLocale;

    // Make sure that MessageFormat supports it
    try {
        new MessageFormat(preferredLocale);
        return preferredLocale;
    } catch (err) {
        return defaultLocale;
    }
}

/**
 * Parse Accept-Language header and return a list of locales
 *
 * @param {string} acceptLanguage The Accept-Language header
 * @returns {string[]} List of locale identifiers
 */
function getLocales(acceptLanguage) {
    const localeObjects = AcceptLanguageParser.parse(acceptLanguage);

    const locales = localeObjects.map(localeObject => {
        return localeObject.region ? `${localeObject.code}-${localeObject.region}` : localeObject.code;
    });

    //  Safari sends only one language code, this is to have a default fallback in case we don't have that language
    //  As an example we may not have fr-FR so add fr to the header
    if (locales.length === 1 && locales[0].split('-').length === 2) {
        locales.push(locales[0].split('-')[0]);
    }

    return locales;
 }

module.exports = {
    getPreferredLocale: getPreferredLocale,
    getLocales: getLocales,
};
