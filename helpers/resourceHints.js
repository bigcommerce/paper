'use strict';

const _ = require('lodash');
const getFonts = require('../lib/fonts');

const fontResources = {
    'Google': [
        '//ajax.googleapis.com',
        '//fonts.googleapis.com',
        '//fonts.gstatic.com',
    ],
};

module.exports = function(paper) {
    paper.handlebars.registerHelper('resourceHints', function() {
        function format(host) {
            return `<link rel="dns-prefetch preconnect" href="${host}" crossorigin>`;
        }

        var hosts = [];

        // Add cdn
        const cdnUrl = paper.settings['cdn_url'] || '';
        if (cdnUrl != '') {
            hosts.push(cdnUrl);
        }

        // Add font providers
        const fontProviders = _.keys(getFonts(paper, 'providerLists'));
        _.each(fontProviders, function(provider) {
            if (typeof fontResources[provider] !== 'undefined') {
                hosts = hosts.concat(fontResources[provider]);
            }
        });

        return new paper.handlebars.SafeString(_.map(hosts, format).join(''));
    });
}
