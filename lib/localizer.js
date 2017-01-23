const _ = require('lodash');
const Hoek = require('hoek');
const LangParser = require('accept-language-parser');
const MessageFormat = require('messageformat');
const internals = {};

/**
 * @param acceptLanguage
 * @param translations
 * @returns {Function}
 */
function localize(acceptLanguage, translations) {
    var preferredTranslation;
    var preferredLangs;
    var suitableLang = 'en';

    // default the preferred translation
    translations = internals.flattenLocales(translations);
    translations = internals.cascadeLocales(suitableLang, translations);

    preferredTranslation = translations[suitableLang] || {};

    preferredLangs = LangParser.parse(acceptLanguage);

    // march down the preferred languages and use the first translatable locale
    _.each(preferredLangs, lang => {
        suitableLang = lang.code;

        if (_.isString(lang.region)) {
            suitableLang += '-' + lang.region;
        }

        if (translations[suitableLang]) {
            preferredTranslation = translations[suitableLang];
            return false;
        }
    });

    return internals.getTranslator(suitableLang, preferredTranslation);
}

module.exports = localize;
localize.internals = internals;

/**
 * This function will load all of the JSON nested locale files and flatten them
 * @param locales
 * @returns {Object}
 */
internals.flattenLocales = function (locales) {
    var output = {};

    _.forOwn(locales, (localeData, localeName) => {
        try {
            output[localeName] = internals.flattenObject(localeData);
        } catch (e) {
            return 'Failed to parse "' + localeName + ' - Error: ' + e;
        }
    });

    return output;
};

/**
 * Cascades the locales from most specific region to least
 *
 * This is only done when the store is first loaded
 * @param rootLocale
 * @param locales
 * @returns {Object}
 */
internals.cascadeLocales = function (rootLocale, locales) {
    var output = {};

    _.forOwn(locales, (uncompiledLocale, localeName) => {
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

            parentLocale = locales[parentCode];

            if (parentLocale) {
                output[localeName] = output[localeName] || uncompiledLocale;
                output[localeName] = Hoek.applyToDefaults(parentLocale, output[localeName]);
            }
        }
    });

    // rootLocale typically 'en' does not cascade
    output[rootLocale] = locales[rootLocale];

    return output;
};

/**
 *
 * @param rootLocale
 * @param uncompiled
 * @returns {Object}
 */
internals.getTranslator = function (localeName, translations) {
    const localeCode = localeName.split('-')[0];
    var formatter;
    var translator;

    try {
        formatter = new MessageFormat(localeCode);
    } catch (e) {
        formatter = new MessageFormat('en');
    }

    translator = (key, parameters) => {
        if (!translations[key]) {
            return key;
        }

        if (typeof translations[key] !== 'function') {
            try {
                translations[key] = formatter.compile(translations[key]);
            } catch (err) {
                if (err.name === 'SyntaxError') {
                    console.error(`Language File Syntax Error: ${err.message} for key "${key}"`, err.expected);
                    return '';
                }

                throw err;
            }
        }

        try {
            return translations[key](parameters);
        } catch (err) {
            // @TODO: add proper logging
            return '';
        }
    };

    translator.localeName = localeName;

    return translator;
};

/**
 * Brings nested JSON parameters to the top level while preserving namespaces with . as a delimiter
 *
 * @param object
 * @returns {Object}
 */
internals.flattenObject = function (object) {
    var out = {};

    _.forOwn(object, (val, key) => {
        if (_.isObject(val)) {
            _.forOwn(internals.flattenObject(val), (val, flattenedKey) => {
                out[key + '.' + flattenedKey] = val;
            });
        } else {
            out[key] = val;
        }
    });

    return out;
};
