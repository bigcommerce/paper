'use strict';

const mapValues = require("./utils/mapValues");

const fontKeyFormat = new RegExp(/\w+(-\w*)*-font$/);
const fontProviders = {
    'Google': {
        /**
         * Parser for Google fonts
         *
         * @param {string[]} fonts - Array of fonts that might look like
         * Google_Open+Sans
         * Google_Open+Sans_400
         * Google_Open+Sans_400_sans
         * Google_Open+Sans_400,700_sans
         * Google_Open+Sans_400,700italic
         * Google_Open+Sans_400,700italic_sans
         *
         * @returns {string[]}
         */
        parser(fonts) {
            const familyHash = {};

            for (const font of fonts) {
                let [, familyKey, weights = ''] = font.split('_');

                if (!familyKey) {
                    continue;
                }

                if (!familyHash[familyKey]) {
                    familyHash[familyKey] = new Set();
                }

                weights.split(',').forEach(weight => familyHash[familyKey].add(weight));
            }

            return Object.entries(familyHash)
                .map(([familyKey, weightsSet]) => familyKey + ':' + [...weightsSet].join(','));
        },

        buildLink(fonts, fontDisplay) {
            const displayTypes = ['auto', 'block', 'swap', 'fallback', 'optional'];
            fontDisplay = displayTypes.includes(fontDisplay) ? fontDisplay : 'swap';
            return `<link href="https://fonts.googleapis.com/css?family=${fonts.join('|')}&display=${fontDisplay}" rel="stylesheet">`;
        },

        buildFontLoaderConfig(fonts) {
            return {
                google: {
                    families: fonts.map(font => font.split('+').join(' ')),
                }
            };
        },
    },
};

/**
 * Get collection of fonts used in theme settings.
 *
 * @param {Object} paper - The paper instance
 * @param {string} format - The desired return value. If format == 'providerLists', return an object with provider names for keys
 *   and a list of fonts in the provider format as values, suitable for use with Web Font Loader. If format == 'linkElements',
 *   return a string containing <link> elements to be directly inserted into the page. If format == 'webFontLoaderConfig', return an
 *   object that can be used to configure Web Font Loader.
 * @param {Object} [options] - an optional object for additional configuration details
 * @returns {Object.<string, Array>|string}
 */
module.exports = function(paper, format, options = {}) {
    // Collect font strings from theme settings
    const collectedFonts = {};
    for (const [key, value] of Object.entries(paper.themeSettings)) {
        if (!fontKeyFormat.test(key)) {
            continue;
        }

        const [provider] = value.split('_');

        if (!fontProviders[provider]) {
            continue;
        }

        if (!collectedFonts[provider]) {
            collectedFonts[provider] = [];
        }

        collectedFonts[provider].push(value);
    }

    // Parse font strings based on provider
    const parsedFonts = mapValues(collectedFonts, function(value, key) {
        return fontProviders[key].parser(value);
    });

    // Format output based on requested format
    switch(format) {
    case 'linkElements':
        const formattedFonts = mapValues(parsedFonts, function(value, key) {
            return fontProviders[key].buildLink(value, options.fontDisplay);
        });
        return new paper.handlebars.SafeString(Object.values(formattedFonts).join(''));

    case 'webFontLoaderConfig':
        // Build configs
        const configs = mapValues(parsedFonts, function(value, key) {
            return fontProviders[key].buildFontLoaderConfig(value);
        });
        // Merge them
        return Object.values(configs).reduce((res, config) => ({...res, ...config}), {});

    case 'providerLists':
    default:
        return parsedFonts;
    }
}
