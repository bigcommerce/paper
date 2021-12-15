'use strict';

/**
 * @module paper/lib/translator/transformer
 */

/**
 * Transform translations
 * @param {Object} allTranslations
 * @param {string[]} locales
 * @param {string} defaultLocale
 * @param {Object} logger
 * @returns {Object.<string, Object>} Transformed translations
 */
function transform(allTranslations, locales, defaultLocale, logger = console) {
    return cascade(flatten(allTranslations, logger), locales, defaultLocale);
}

/**
 * Flatten translations
 * @param {Object} allTranslations
 * @param {Object} logger
 * @returns {Object.<string, Object>} Flatten translations
 */
function flatten(allTranslations, logger = console) {
    return Object.entries(allTranslations)
        .reduce(
            (result, [locale, translation]) => {
                try {
                    result[locale] = flattenObject(translation);
                } catch (err) {
                    logger.error(`Failed to parse ${locale} - Error: ${err}`);

                    result[locale] = {};
                }

                return result;
            },
            {}
        );
}

/**
 * Cascade translations
 * 
 * @param {Object} allTranslations Flattened translations
 * @param {string[]} locales
 * @param {string} defaultLocale
 * @returns {Object.<string, Object>} Language objects
 */
function cascade(allTranslations, locales, defaultLocale) {
    const availableLocales = addDefaultLocale(locales, defaultLocale);
    return Object.entries(allTranslations)
        .reduce(
            (result, [locale, translations]) => {
                if (!result[locale]) {
                    result[locale] = { locale: locale, locales: {}, translations: {} };
                }

                const regionCodes = locale.split('-');
                for (let regionIndex = regionCodes.length - 1; regionIndex >= 0; regionIndex--) {
                    // keeping parent locale logic as a source of truth to track "available" keys 
                    const parentLocale = getParentLocale(regionCodes, regionIndex, defaultLocale);
                    const parentTranslations = allTranslations[parentLocale] || {};

                    new Set(
                        Object.keys(parentTranslations).concat(Object.keys(translations))
                    ).forEach((key) => {
                        if (translations[key]) {
                            result[locale].locales[key] = locale;
                            result[locale].translations[key] = translations[key];
                        } else if (!result[locale].translations[key]) {
                            const preparedLocales = prepareLocales(availableLocales, locale);
                            const { nextAvailableLocale, nextAvailableTranslation } = getNextLocaleTranslation(preparedLocales, allTranslations, key);
                             // fallback to old logic in case no languages are present in lang header
                            result[locale].locales[key] = nextAvailableLocale || parentLocale;
                            result[locale].translations[key] = nextAvailableTranslation || parentTranslations[key]; 
                        }
                    });
                }

                return result;
            },
            {}
        );
}

/**
 * Adding default locale in case it's absent
 * 
 * @param {string[]} locales
 * @param {string} defaultLocale
 * @returns {string[]}
 */
 function addDefaultLocale(locales, defaultLocale) {
    // the object will be mutated, so making a copy of it.
   const copiedLocales = [...locales];
   if (locales[locales.length - 1] !== defaultLocale) {
       copiedLocales.push(defaultLocale);
   }
   return copiedLocales;
}

/**
 * Adding default locale in case it's absent
 * 
 * @param {string[]} availableLocales
 * @param {string} currentLocale
 * @returns {string[]}
 */
function prepareLocales(availableLocales, currentLocale) {
    const localeIndex = availableLocales.findIndex(locale => locale == currentLocale);
    const locales = availableLocales.slice(localeIndex + 1);
    return locales;
}

/**
 * Returns next available pair (locale and translation) in the chain
 * 
 * @param {string[]} locales
 * @param {Object} allTranslations Flattened translations
 * @param {string} key
 * @returns {Object.<string, string>} selected locale and translation
 */
function getNextLocaleTranslation(locales, allTranslations, key) {
    for (const locale of locales) {
        if (allTranslations[locale] && allTranslations[locale][key]) {
            return {
                nextAvailableLocale: locale,
                nextAvailableTranslation: allTranslations[locale][key],
            }
        }
    }

    return {};
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
        .reduce(
            (currentLayer, [key, innerValue]) => {
                const resultKey = parentKey !== '' ? `${parentKey}.${key}` : key;
                if (typeof innerValue === 'object') {
                    return flattenObject(innerValue, currentLayer, resultKey);
                }
                currentLayer[resultKey] = innerValue;
                return currentLayer;
            },
            result
        );
}

module.exports = {
    cascade: cascade,
    flatten: flatten,
    transform: transform,
};
