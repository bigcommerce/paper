var _ = require('lodash'),
    Hoek = require('hoek'),
    LangParser = require('accept-language-parser'),
    MessageFormat = require('messageformat'),
    internals = {};

/**
 * @param acceptLanguage
 * @param translations
 * @returns {Function}
 */
module.exports = function (acceptLanguage, translations) {
    var compiledTranslations,
        preferredTranslation,
        preferredLangs,
        suitableLang = 'en';

    // default the preferred translation
    translations = internals.flattenLocales(translations);
    translations = internals.cascadeLocales(suitableLang, translations);

    preferredTranslation = translations[suitableLang] || {};

    preferredLangs = LangParser.parse(acceptLanguage);

    // march down the preferred languages and use the first translatable locale
    _.each(preferredLangs, function (lang) {
        suitableLang = lang.code;

        if (_.isString(lang.region)) {
            suitableLang += '-' + lang.region;
        }

        if (translations[suitableLang]) {
            preferredTranslation = translations[suitableLang];
            return false;
        }
    });

    // return a translator function
    return internals.getTranslator(suitableLang, preferredTranslation);
};

/**
 * This function will load all of the JSON nested locale files and flatten them
 * @param locales
 * @returns {Object}
 */
internals.flattenLocales = function (locales) {
    var output = {};

    var a = new Hoek.Timer();
    _.forOwn(locales, function (localeData, localeName) {
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

    _.forOwn(locales, function (uncompiledLocale, localeName) {
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
    var localeCode = localeName.split('-')[0],
        formatter = new MessageFormat(localeCode);

    return function (key, parameters) {

        if (!translations[key]) {
            return key;
        }

        if (typeof translations[key] !== 'function') {
            translations[key] = formatter.compile(translations[key]);
        }

        return translations[key](parameters);
    };
};

/**
 * Brings nested JSON parameters to the top level while preserving namespaces with . as a delimiter
 *
 * @param object
 * @returns {Object}
 */
internals.flattenObject = function (object) {
    var out = {};
    _.forOwn(object, function (val, key) {
        if (_.isObject(val)) {
            _.forOwn(internals.flattenObject(val), function (val, flattenedKey) {
                out[key + '.' + flattenedKey] = val;
            });
        } else {
            out[key] = val;
        }
    });

    return out;
};
