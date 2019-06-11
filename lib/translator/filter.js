'use strict';

/**
 * @module paper/lib/translator/filter
 */

/**
 * Filter translation by key
 * @param {Object.<string, string>} language
 * @param {string} keyFilter
 * @returns {Object.<string, string>}
 */
function filterByKey(language, keyFilter) {
    const languages = Object.keys(language);
    const filteredTranslations = {};
    for (let i = 0; i < languages.length; i++) {
        const objField = language[languages[i]];
        if (languages[i] === 'translations' || languages[i] === 'locales') {
            const filterKeys = Object.keys(objField);
            const pickedElements = {};
            for (let j = 0; j < filterKeys.length; j++) {
                if (filterKeys[j].startsWith(keyFilter)) {
                    pickedElements[filterKeys[j]] = objField[filterKeys[j]];
                }
            }
            filteredTranslations[languages[i]] = pickedElements;
        } else {
            filteredTranslations[languages[i]] = objField;
        }
    }
    return filteredTranslations;
}

module.exports = {
    filterByKey: filterByKey,
};
