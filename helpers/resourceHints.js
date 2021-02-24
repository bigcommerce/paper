'use strict';

const getFonts = require('../lib/fonts');

const fontResources = {
    'Google': [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
    ],
};

function format(host) {
    return `<link rel="dns-prefetch preconnect" href="${host}" crossorigin>`;
}

module.exports = function(paper) {
    paper.handlebars.registerHelper('resourceHints', function() {
        const hosts = [];

        // Add cdn
        if (paper.settings['cdn_url']) {
            hosts.push(paper.settings['cdn_url']);
        }

        // Add font providers
        for (let provider of Object.keys(getFonts(paper, 'providerLists'))) {
            if (fontResources[provider]) {
                hosts.push(...fontResources[provider]);
            }
        }

        return new paper.handlebars.SafeString(hosts.map(format).join(''));
    });
}
