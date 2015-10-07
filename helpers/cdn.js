var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('cdn', function(assetPath) {
        var settings = context.settings || {};
        var cdnUrl = settings['cdn_url'];
        var versionId = settings['theme_version_id'];
        var configId = settings['theme_config_id'];

        if (!assetPath) {
            return;
        }

        if (/^(?:https?:)?\/\//.test(assetPath)) {
            return assetPath;
        }

        if (assetPath[0] !== '/') {
            assetPath = '/' + assetPath;
        }

        if (!cdnUrl) {
            return assetPath;
        }

        if (assetPath.substr(0, 8) === '/assets/') {
            assetPath = assetPath.substr(8, assetPath.length);
        }

        if (assetPath.substr(-4) === '.css') {
            return [cdnUrl,'stencil', versionId, configId, assetPath].join('/');
        } else {
            return [cdnUrl,'stencil', versionId, assetPath].join('/');
        }
    });
};

module.exports = internals.implementation;
