var _ = require('lodash'),
    Fs = require('fs'),
    Hoek = require('hoek'),
    MessageFormat = require('messageformat');

/**
 * This function will load all of the JSON nested locale files and flatten them, as well as compile them
 * for use with the messageformat.js translation library.
 * The nested translation files become flattened key strings so translation lookup is done in O(1) time.
 * @param rootLocale
 * @param locales
 * @returns {*}
 */
module.exports.compileTranslations = function (rootLocale, locales) {
    var compiledLocales,
        flattenedLocales = {};

    _.forOwn(locales, function(localeData, localeName) {
        try {
            flattenedLocales[localeName] = flattenLocale(JSON.parse(localeData));
        } catch (e) {
            return 'Failed to parse "' + localeName + ' - Error: ' + e;
        }
    });
    compiledLocales = compileLocales(rootLocale, flattenedLocales);

    return compiledLocales;
};

/**
 * Cascades the locales from most specific region to least
 *
 * This is only done when the store is first loaded
 * @param rootLocale
 * @param uncompiledLocales
 * @returns {{}}
 */
function cascadeLocales(rootLocale, uncompiledLocales) {
    var cascadedLocales = {};

    _.forOwn(uncompiledLocales, function (uncompiledLocale, localeName) {
        var regionCodes = localeName.split('-'),
            depth = regionCodes.length - 1,
            parentCode,
            parentLocale,
            regionIndex = depth;

        for (regionIndex; regionIndex >= 0; regionIndex--) {

            // if we are at a top level non-root locale, use the rootLocale as parent (fr-CA => fr => en)
            if (regionIndex == 0 && regionCodes[0] != rootLocale) {
                parentCode = rootLocale;
            } else {
                // otherwise, select the current locale code with the most specific region chopped off
                parentCode = regionCodes.slice(0, regionIndex).join('-');
            }

            parentLocale = uncompiledLocales[parentCode];

            if (parentLocale) {
                cascadedLocales[localeName] = cascadedLocales[localeName] || uncompiledLocale;
                cascadedLocales[localeName] = Hoek.applyToDefaults(parentLocale, cascadedLocales[localeName]);
            }
        }
    });

    // rootLocale typically 'en' does not cascade
    cascadedLocales[rootLocale] = uncompiledLocales[rootLocale];

    return cascadedLocales;
}

/**
 * Compilation is done separately from loading of locale data because we must first cascade the locales
 * @param localeName
 * @param uncompiledLocaleData
 * @returns {{}}
 */
function compileLocale(localeName, uncompiledLocaleData) {
    var localeCode = localeName.split('-')[0],
        formatter = new MessageFormat(localeCode),
        compiledLocale = {},
        workingKey = '';

    try {
        // precompile the translations 'cause we have a need for speed!
        _.forOwn(uncompiledLocaleData, function (translationValue, translationKey) {
            workingKey = translationKey;
            compiledLocale[translationKey] = formatter.compile(translationValue);
        });

    } catch (e) {
        throw new Error('Failed to compile "' + workingKey + '" in ' + localeName + '.json - Error: ' + e);
    }

    return compiledLocale;
}

/**
 *
 * @param rootLocale
 * @param uncompiledLocales
 */
function compileLocales(rootLocale, uncompiledLocales) {
    var compiledLocales = {},
        locales = cascadeLocales(rootLocale, uncompiledLocales); //the master locale from which all locales derive

    _.forOwn(locales, function compilingLocale(loadedLocale, localeName) {
        compiledLocales[localeName] = compileLocale(localeName, loadedLocale);
    });

    return compiledLocales;
}

/**
 * Brings nested JSON parameters to the top level while preserving namespaces with . as a delimiter
 * {
 *      hi: {
 *          there: {
 *              lol: 'This is a test'
 *          }
 *      }
 * }
 *
 * Will become
 * {
 *     'hi.there.lol': 'This is a test'
 * }
 *
 * @param localeJSONData
 * @returns {}
 */
function flattenLocale(localeJSONData) {
    var out = {};
    _.forOwn(localeJSONData, function iterateJSON(val, key) {
        if (_.isObject(val)) {
            _.forOwn(flattenLocale(val), function iterateJSONObject(val, flattenedKey) {
                out[key + '.' + flattenedKey] = val;
            });
        } else {
            out[key] = val;
        }
    });

    return out;
}