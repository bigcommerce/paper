module.exports = function (paper, handlebars, context) {
    handlebars.registerHelper('cdn', function(assetPath) {
        var ret;

        if (/^(?:https?:)?\/\//.test(assetPath)) {
            return assetPath;
        }

        if (assetPath[0] !== '/') {
            assetPath = '/' + assetPath;
        }

        if (assetPath.substr(-4) === '.css') {
            ret = context.cdn_url_with_settings_hash + assetPath;
        } else if (context.cdn_url) {
            ret = context.cdn_url + assetPath;
        } else {
            ret = assetPath;
        }

        return ret;
    });
};
