const isString = require('./isString');
const isObject = require('./isObject');

/**
 * Clone of https://lodash.com/docs/4.17.15#includes
 *
 * Checks if `value` is in `collection`. If `fromIndex` is negative, it is used as the offset
 * from the end of `collection`.
 *
 * @param {Array|Object|string} collection - The collection to search.
 * @param {any} target - The value to search for.
 * @param {number} [fromIndex=0] - The index to search from.
 * @returns {boolean} Returns `true` if a matching element is found, else `false`.
 * @example
 *
 * includes([1, 2, 3], 1);
 * // => true
 *
 * includes([1, 2, 3], 1, 2);
 * // => false
 *
 * includes({ 'user': 'fred', 'age': 40 }, 'fred');
 * // => true
 *
 * includes('pebbles', 'eb');
 * // => true
 */
function includes(collection, target, fromIndex) {
    if (!isString(collection) && !isObject(collection)) {
        return false;
    }

    const values = Array.isArray(collection) || isString(collection)
        ? collection
        : Object.values(collection);
    const formattedFromIndex = typeof fromIndex !== 'number'
        ? 0
        : fromIndex < 0
            ? Math.max(values.length + fromIndex, 0)
            : (fromIndex || 0);

    return formattedFromIndex <= values.length
        && values.indexOf(target, formattedFromIndex) > -1;
}

module.exports = includes;
