var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('cdn', function(assetPath) {
        var ret;

        if (/^(?:https?:)?\/\//.test(assetPath)) {
            return assetPath;
        }

        if (!assetPath) {
            return;
        }

        if (assetPath[0] !== '/') {
            assetPath = '/' + assetPath;
        }

        if (context.cdn_url) {
            ret = context.cdn_url + assetPath;
        } else {
            ret = assetPath;
        }

        return ret;
    });
};

module.exports = internals.implementation;
