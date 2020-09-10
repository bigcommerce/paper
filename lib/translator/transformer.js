'use strict';

/**
 * @module paper/lib/translator/transformer
 */

const isObject = require('../utils/isObject');
const Logger = require('../logger');

/**
 * Transform translations
 * @param {Object} allTranslations
 * @param {string} defaultLocale
 * @returns {Object.<string, Object>} Transformed translations
 * @param {Object} logger
 */
function transform(allTranslations, defaultLocale, logger = Logger) {
    return cascade(flatten(allTranslations, logger), defaultLocale);
}

/**
 * Flatten translations
 * @param {Object} allTranslations
 * @returns {Object.<string, Object>} Flatten translations
 * @param {Object} logger
 */
function flatten(allTranslations, logger = Logger) {
    return Object.entries(allTranslations)
        .reduce((result, [locale, translation]) => {
            try {
                result[locale] = flattenObject(translation);
            } catch (err) {
                logger.error(`Failed to parse ${locale} - Error: ${err}`);

                result[locale] = {};
            }

            return result;
        }, {});
}

/**
 * Cascade translations
 * @param {Object} allTranslations Flattened translations
 * @param {string} defaultLocale
 * @returns {Object.<string, Object>} Language objects
 */
function cascade(allTranslations, defaultLocale) {
    return Object.entries(allTranslations)
        .reduce((result, [locale, translations]) => {
            if (!result[locale]) {
                result[locale] = { locale: locale, locales: {}, translations: {} };
            }

            const regionCodes = locale.split('-');
            for (let regionIndex = regionCodes.length - 1; regionIndex >= 0; regionIndex--) {
                const parentLocale = getParentLocale(regionCodes, regionIndex, defaultLocale);
                const parentTranslations = allTranslations[parentLocale] || {};

                new Set(Object.keys(parentTranslations).concat(Object.keys(translations)))
                    .forEach((key) => {
                        if (translations[key]) {
                            result[locale].locales[key] = locale;
                            result[locale].translations[key] = translations[key];
                        } else if (!result[locale].translations[key]) {
                            result[locale].locales[key] = parentLocale;
                            result[locale].translations[key] = parentTranslations[key];
                        }
                    });
            }

            return result;
        }, {});
}

/**
 * Get parent locale
 * @private
 * @param {string[]} regionCodes
 * @param {number} regionIndex
 * @param {string} defaultLocale
 * @returns {string} Parent locale
 */
function getParentLocale(regionCodes, regionIndex, defaultLocale) {
    if (regionIndex === 0 && regionCodes[0] !== defaultLocale) {
        return defaultLocale;
    }

    return regionCodes.slice(0, regionIndex).join('-');
}

/**
 * Brings nested JSON parameters to the top level while preserving namespaces with . as a delimiter
 * @private
 * @param {Object} object
 * @param {Object} [result={}]
 * @param {string} [parentKey='']
 * @returns {Object} Flatten object
 */
function flattenObject(object, result = {}, parentKey = '') {
    return Object.entries(object)
        .reduce((currentLayer, [key, innerValue]) => {
            const resultKey = parentKey ? `${parentKey}.${key}` : key;

            if (isObject(innerValue)) {
                return flattenObject(innerValue, currentLayer, resultKey);
            }

            currentLayer[resultKey] = innerValue;

            return currentLayer;
        }, result);
}

module.exports = {
    cascade: cascade,
    flatten: flatten,
    transform: transform,
};
