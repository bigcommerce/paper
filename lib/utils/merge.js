const isObject = require('./isObject');

/**
 * Clone of https://lodash.com/docs/4.17.15#merge
 *
 * Performs a deep merge of objects and returns a new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...Object} objects - Objects to merge
 * @returns {Object} New object with merged key/values
 * @example
 *
 * var users = {
 *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
 * };
 *
 * var ages = {
 *   'data': [{ 'age': 36 }, { 'age': 40 }]
 * };
 *
 * merge(users, ages);
 * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
 */
function merge(...objects) {
    return objects.reduce((prev, obj) => {
        for (const key of Object.keys(obj)) {
            const pVal = prev[key];
            const oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            }
            else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = merge(pVal, oVal);
            }
            else {
                prev[key] = oVal;
            }
        }

        return prev;
    }, {});
}

module.exports = merge;
