const isObject = require('./isObject');

/**
 * Clone of https://lodash.com/docs/4.17.15#isMatch
 *
 * Checks if `pattern` object matches the `source` object.
 * It performs deep comparison of all pattern's properties but doesn't try to find the pattern deeply in source.
 *
 * @param {Object} source - The object to inspect
 * @param {Object} pattern - The object of property values to match
 * @returns {Boolean} - Returns true if `pattern` has a `match` in source, else false
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 *
 * isMatch(object, { 'b': 2 });
 * // => true
 *
 * isMatch(object, { 'b': 1 });
 * // => false
 */
function isMatch(source, pattern) {
    if (source === pattern) {
        return true;
    }

    return Object.entries(pattern).every(([patternKey, patterValue]) => {
        if (!(patternKey in source)) {
            return false
        }
        const sourceValue = source[patternKey];
        if (patterValue === sourceValue) {
            return true
        }
        if (isObject(patterValue) && isObject(sourceValue)) {
            return isMatch(sourceValue, patterValue)
        }
        return false;
    })
}

module.exports = isMatch;
