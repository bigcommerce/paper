/**
 * Clone of https://lodash.com/docs/4.17.15#pickBy
 *
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 *
 * @param {Object} object The source object.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'user': 'fred', 'age': 40 };
 *
 * pickBy(object, (value, key) => key === 'user');
 * // => { 'user': 'fred' }
 *
 * pickBy(object, value => typeof value === 'string');
 * // => { 'user': 'fred' }
 */
function pickBy(object, predicate) {
    return Object.entries(object)
        .reduce((resObj, [key, value]) => {
            if (predicate(value, key)) {
                resObj[key] = value;
            }

            return resObj;
        }, {});
}

module.exports = pickBy;
