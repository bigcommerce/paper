'use strict';

/**
 * @module paper/lib/translator/transformer
 */

const Logger = require('../logger');

/**
 * Transform translations
 * @param {Object} allTranslations
 * @param {string} defaultLocale
 * @param {Object} logger
 * @returns {Object.<string, Object>} Transformed translations
 */
function transform(allTranslations, defaultLocale, logger = Logger) {
    return cascade(flatten(allTranslations, logger), defaultLocale);
}

/**
 * Flatten translations
 * @param {Object} allTranslations
 * @param {Object} logger
 * @returns {Object.<string, Object>} Flatten translations
 */
function flatten(allTranslations, logger = Logger) {
    const allTranslationsKeys = Object.keys(allTranslations);
    const flattenedTranslations = {};

    for (let i = 0; i < allTranslationsKeys.length; i++) {
        const translationKey = allTranslationsKeys[i];
        try {
            flattenedTranslations[translationKey] = flattenObject(allTranslations[translationKey]);
        } catch (err) {
            logger.error(`Failed to parse ${translationKey} - Error: ${err}`);
            flattenedTranslations[translationKey] = {};
        }
    }

    return flattenedTranslations;
}

/**
 * Cascade translations
 * @param {Object} allTranslations Flattened translations
 * @param {string} defaultLocale
 * @returns {Object.<string, Object>} Language objects
 */
function cascade(allTranslations, defaultLocale) {
    const cascadedTranslations = {};
    const allTranslationsKeys = Object.keys(allTranslations);

    for (let i = 0; i < allTranslationsKeys.length; i++) {
        const localeKey = allTranslationsKeys[i];
        const regionCodes = localeKey.split('-');

        for (let regionIndex = regionCodes.length - 1; regionIndex >= 0; regionIndex--) {
            const parentLocale = getParentLocale(regionCodes, regionIndex, defaultLocale);
            const parentTranslations = allTranslations[parentLocale] || {};
            const translationKeys = [...new Set(Object.keys(parentTranslations).concat(Object.keys(allTranslations[localeKey])))];

            if (!cascadedTranslations[localeKey]) {
                cascadedTranslations[localeKey] = { locale: localeKey, locales: {}, translations: {} };
            }

            const translations = allTranslations[localeKey];

            for (let j = 0; j < translationKeys.length; j++) {
                const translationKey = translationKeys[j];
                if (translations[translationKey]) {
                    cascadedTranslations[localeKey].locales[translationKey] = localeKey;
                    cascadedTranslations[localeKey].translations[translationKey] = translations[translationKey];
                } else if (!cascadedTranslations[localeKey].translations[translationKey]) {
                    cascadedTranslations[localeKey].locales[translationKey] = parentLocale;
                    cascadedTranslations[localeKey].translations[translationKey] = parentTranslations[translationKey];
                }
            }
        }
    }
    return cascadedTranslations;
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
function flattenObject(object, result, parentKey) {
    function flattenObjectConductor(object, result, parentKey) {
        result = result || {};
        parentKey = parentKey || '';
        const objectKeys = Object.keys(object);

        for (let i = 0; i < objectKeys.length; i++) {
            const key = objectKeys[i];
            const resultKey = parentKey ? `${parentKey}.${key}` : key;

            if (object[key] !== null && typeof object[key] === 'object') {
                return flattenObjectConductor(object[key], result, resultKey);
            }
            result[resultKey] = object[key];
        }
        return result;
    }

    return flattenObjectConductor(object, result, parentKey);
}

module.exports = {
    cascade: cascade,
    flatten: flatten,
    transform: transform,
};
