'use strict';

/**
 * @module paper/lib/translator/transformer
 */

const _ = require('lodash');
const Logger = require('../logger');

/**
 * Transform translations
 * @param {Object} translations
 * @param {string} defaultLocaleName
 * @returns {Object.<string, Object>} Transformed translations
 */
function transform(translations, defaultLocaleName) {
    return cascade(flatten(translations), defaultLocaleName);
};

/**
 * Flatten translations
 * @param {Object} translations
 * @returns {Object.<string, Object>} Flatten translations
 */
function flatten(translations) {
    const output = {};

    _.forOwn(translations, (translation, localeName) => {
        try {
            output[localeName] = flattenObject(translation);
        } catch (err) {
            Logger.log(`Failed to parse ${localeName} - Error: ${err}`);

            output[localeName] = {};
        }
    });

    return output;
};

/**
 * Cascade translations
 * @param {Object} translations
 * @param {string} defaultLocaleName
 * @returns {Object.<string, Object>} Cascaded translations
 */
function cascade(translations, defaultLocaleName) {
    const output = {};

    _.forOwn(translations, (translation, localeName) => {
        const regionCodes = localeName.split('-');
        const depth = regionCodes.length - 1;

        let parentLocaleName;
        let parentTranslation;

        for (let regionIndex = depth; regionIndex >= 0; regionIndex--) {
            // if we are at a top level non-root locale, use the rootLocale as parent (fr-CA => fr => en)
            if (regionIndex === 0 && regionCodes[0] !== defaultLocaleName) {
                parentLocaleName = defaultLocaleName;
            } else {
                // otherwise, select the current locale code with the most specific region chopped off
                parentLocaleName = regionCodes.slice(0, regionIndex).join('-');
            }

            parentTranslation = translations[parentLocaleName];

            if (parentTranslation) {
                output[localeName] = output[localeName] || translation;
                output[localeName] = _.assign({}, parentTranslation, output[localeName]);
            }
        }
    });

    // rootLocale typically 'en' does not cascade
    output[defaultLocaleName] = translations[defaultLocaleName];

    return output;
};

/**
 * Brings nested JSON parameters to the top level while preserving namespaces with . as a delimiter
 * @private
 * @param {Object} object
 * @param {Object} [result={}]
 * @param {string} [parentKey='']
 * @returns {Object} Flatten object
 */
function flattenObject(object, result, parentKey) {
    result = result || {};
    parentKey = parentKey || '';

    _.forOwn(object, (value, key) => {
        const resultKey = parentKey ? `${parentKey}.${key}` : key;

        if (_.isObject(value)) {
            return flattenObject(value, result, resultKey);
        }

        result[resultKey] = value;
    });

    return result;
};

module.exports = {
    cascade: cascade,
    flatten: flatten,
    transform: transform,
};
