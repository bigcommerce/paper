/**
 * Checks if the value is an object
 *
 * @param {any} value - The value to check.
 * @returns {boolean} - Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * isObject({});
 * // => true
 *
 * isObject([1, 2, 3]);
 * // => true
 *
 * isObject(_.noop);
 * // => true
 *
 * isObject(null);
 * // => false
 */
const isObject = value => value && typeof value === 'object';

module.exports = isObject;
