'use strict';

/**
 * @module paper/lib/translator/filter
 */

const pickBy = require('../utils/pickBy');

/**
 * Filter translation and locales by keyFilter
 * @param {Object.<string, string>} language
 * @param {string} keyFilter
 * @returns {Object.<string, string>}
 */
function filterByKey(language, keyFilter) {
    return Object.entries(language)
        .reduce((result, [key, value]) => {
            if (key === 'translations' || key === 'locales') {
                result[key] = pickBy(value, (innerValue, innerKey) => innerKey.startsWith(keyFilter));
            } else {
                result[key] = language[key];
            }

            return result;
        }, {});
}

module.exports = {
    filterByKey: filterByKey,
};
