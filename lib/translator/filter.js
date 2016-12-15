'use strict';

/**
 * @module paper/lib/translator/filter
 */

const _ = require('lodash');

/**
 * Filter translation by key
 * @param {Object.<string, string>} translation
 * @param {string} keyFilter
 * @returns {Object.<string, string>}
 */
function filterByKey(translation, keyFilter) {
    return _.transform(translation, (result, value, key) => {
        if (key.indexOf(keyFilter) === 0) {
            result[key] = value;
        }
    }, {});
}

module.exports = {
    filterByKey: filterByKey,
};
