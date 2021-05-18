'use strict';

/**
 * @module paper/lib/translator/filter
 */

/**
 * Filter translation and locales by translation key
 * @param {Object.<string, string|Object>} language
 * @param {string} keyFilter
 * @returns {Object.<string, string|Object>}
 */
function filterByKey(language, keyFilter) {
    const result = {};
    const languageKeys = Object.keys(language);
    for (let i = 0; i < languageKeys.length; i++) {
        const key = languageKeys[i];
        if (key === 'translations' || key === 'locales') {
            const languageSubKeys = Object.keys(language[key]);
            result[key] = {};
            for (let k = 0; k < languageSubKeys.length; k++) {
                const subKey = languageSubKeys[k];
                if (subKey.startsWith(keyFilter)) {
                    result[key][subKey] = language[key][subKey];
                }
            }
        } else if (key !== 'compiledTranslations') {
            result[key] = language[key];
        }
    }

    return result;
}

module.exports = {
    filterByKey: filterByKey,
};
