/**
 * Check if the value is classified as a string primitive or string object.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} - Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * isString('abc');
 * // => true
 *
 * isString(new String('abc'));
 * // => true
 *
 * isString(1);
 * // => false
 */
const isString = value => typeof value === 'string' || value instanceof String;

module.exports = isString;
