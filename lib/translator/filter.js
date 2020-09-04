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
    return Object.entries(language)
        .reduce(
            (result, [key, value]) => {
                switch (key) {
                    case 'translations':
                    case 'locales':
                        result[key] =
                            Object.entries(value)
                                .reduce(
                                    (filteredInnerObject, [innerKey, innerValue]) => {
                                        if (innerKey.startsWith(keyFilter)) {
                                            filteredInnerObject[innerKey] = innerValue;
                                        }

                                        return filteredInnerObject;
                                    },
                                    {}
                                );

                        return result;
                    default:
                        result[key] = language[key];

                        return result;
                }
            },
            {}
        );
}

module.exports = {
    filterByKey: filterByKey,
};
