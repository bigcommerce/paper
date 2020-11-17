'use strict';

/**
 * @module paper/lib/translator/transformer
 */

/**
 * Transform translations from the representation provided by stencil bundle
 * into something that enables fast lookups in the `lang` helper.
 *
 * The `allTranslations` object looks like this:
 * {
 *   en: {
 *     salutations: {
 *       welcome: 'Welcome',
 *       hello: 'Hello {name}',
 *       bye: 'Bye bye',
 *     }
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   },
 *   fr: {
 *     salutations: {
 *       hello: 'Bonjour {name}',
 *       bye: 'au revoir',
 *     }
 *   },
 *   'fr-CA': {
 *     salutations: {
 *       hello: 'Salut {name}',
 *     },
 *   },
 * }
 *
 * The return value looks like this:
 * {
 *   en: {
 *     locale: 'en',
 *     locales: {
 *       'salutations.welcome': 'en',
 *       'salutations.hello': 'en',
 *       'salutations.bye': 'en',
 *       items: 'en',
 *     },
 *     translations: {
 *       'salutations.welcome': 'Welcome',
 *       'salutations.hello': 'Hello {name}',
 *       'salutations.bye': 'Bye bye',
 *       items: '{count, plural, one{1 Item} other{# Items}}',
 *     }
 *   },
 *   fr: {
 *     locale: 'fr',
 *     locales: {
 *       'salutations.welcome': 'en',
 *       'salutations.hello': 'fr',
 *       'salutations.bye': 'fr',
 *       items: 'en',
 *     },
 *     translations: {
 *       'salutations.welcome': 'Welcome',
 *       'salutations.hello': 'Bonjour {name}',
 *       'salutations.bye': 'au revoir',
 *       items: '{count, plural, one{1 Item} other{# Items}}',
 *     }
 *   },
 *   'fr-CA': {
 *     locale: 'fr-CA',
 *     locales: {
 *       'salutations.welcome': 'en',
 *       'salutations.hello': 'fr-CA',
 *       'salutations.bye': 'fr',
 *       items: 'en',
 *     },
 *     translations: {
 *       'salutations.welcome': 'Welcome',
 *       'salutations.hello': 'Salut {name}',
 *       'salutations.bye': 'au revoir',
 *       items: '{count, plural, one{1 Item} other{# Items}}',
 *     }
 *   },
 * }
 *
 * @param {Object.<string, Object>} allTranslations
 * @param {string} defaultLocale
 * @param {Object} logger
 * @returns {Object.<string, Object>} Transformed translations
 */
function transform(allTranslations, defaultLocale, logger = console) {
    return cascade(flatten(allTranslations, logger), defaultLocale);
}

/**
 * Flatten translation keys to a single top-level namespace.
 *
 * The `allTranslations` object looks like this:
 * {
 *   en: {
 *     salutations: {
 *       welcome: 'Welcome',
 *       hello: 'Hello {name}',
 *       bye: 'Bye bye',
 *       formal: {
 *           bye: 'Farewell',
 *       }
 *     }
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   },
 *   fr: {
 *     salutations: {
 *       hello: 'Bonjour {name}',
 *       bye: 'au revoir',
 *     }
 *   },
 *   'fr-CA': {
 *     salutations: {
 *       hello: 'Salut {name}',
 *     },
 *   },
 * }
 *
 * The return value looks like this:
 * {
 *   en: {
 *     'salutations.welcome': 'Welcome',
 *     'salutations.hello': 'Hello {name}',
 *     'salutations.bye': 'Bye bye',
 *     'salutations.formal.bye': 'Farewell',
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   },
 *   fr: {
 *     'salutations.hello': 'Bonjour {name}',
 *     'salutations.bye': 'au revoir',
 *   },
 *   'fr-CA': {
 *     'salutations.hello': 'Salut {name}',
 *   },
 * }
 * @param {Object.<string, Object>} allTranslations
 * @param {Object} logger
 * @returns {Object.<string, Object>} Flattened translations
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
 * Cascade translations by providing appropriate fallback values. For example, if 'fr-CA'
 * is requested but the translation override doesn't exist, we fallback first to 'fr', then
 * to the defaultLocale (usually 'en').
 *
 * flattenedTranslations looks like this:
 * {
 *   en: {
 *     'salutations.welcome': 'Welcome',
 *     'salutations.hello': 'Hello {name}',
 *     'salutations.bye': 'Bye bye',
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   },
 *   fr: {
 *     'salutations.hello': 'Bonjour {name}',
 *     'salutations.bye': 'au revoir',
 *   },
 *   'fr-CA': {
 *     'salutations.hello': 'Salut {name}',
 *   },
 * }
 *
 * The return value looks like this:
 * {
 *   en: {
 *     locale: 'en',
 *     locales: {
 *       'salutations.welcome': 'en',
 *       'salutations.hello': 'en',
 *       'salutations.bye': 'en',
 *       items: 'en',
 *     },
 *     translations: {
 *       'salutations.welcome': 'Welcome',
 *       'salutations.hello': 'Hello {name}',
 *       'salutations.bye': 'Bye bye',
 *       items: '{count, plural, one{1 Item} other{# Items}}',
 *     }
 *   },
 *   fr: {
 *     locale: 'fr',
 *     locales: {
 *       'salutations.welcome': 'en',
 *       'salutations.hello': 'fr',
 *       'salutations.bye': 'fr',
 *       items: 'en',
 *     },
 *     translations: {
 *       'salutations.welcome': 'Welcome',
 *       'salutations.hello': 'Bonjour {name}',
 *       'salutations.bye': 'au revoir',
 *       items: '{count, plural, one{1 Item} other{# Items}}',
 *     }
 *   },
 *   'fr-CA': {
 *     locale: 'fr-CA',
 *     locales: {
 *       'salutations.welcome': 'en',
 *       'salutations.hello': 'fr-CA',
 *       'salutations.bye': 'fr',
 *       items: 'en',
 *     },
 *     translations: {
 *       'salutations.welcome': 'Welcome',
 *       'salutations.hello': 'Salut {name}',
 *       'salutations.bye': 'au revoir',
 *       items: '{count, plural, one{1 Item} other{# Items}}',
 *     }
 *   },
 * }
 *
 * @param {Object.<string, Object>} flattenedTranslations Flattened translations
 * @param {string} defaultLocale
 * @returns {Object.<string, Object>} Cascaded translations spec
 */
function cascade(flattenedTranslations, defaultLocale) {
    return Object.entries(flattenedTranslations)
        .reduce(
            (result, [locale, translations]) => {
                if (!result[locale]) {
                    result[locale] = { locale: locale, locales: {}, translations: {} };
                }

                const regionCodes = locale.split('-');
                for (let regionIndex = regionCodes.length - 1; regionIndex >= 0; regionIndex--) {
                    const parentLocale = getParentLocale(regionCodes, regionIndex, defaultLocale);
                    const parentTranslations = flattenedTranslations[parentLocale] || {};

                    new Set(
                        Object.keys(parentTranslations).concat(Object.keys(translations))
                    ).forEach((key) => {
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
            },
            {}
        );
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
 * Internal method to flatten nested JSON to the top level, tranforming nested keys
 * using dot syntax.
 *
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
