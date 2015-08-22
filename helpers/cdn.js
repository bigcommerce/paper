module.exports = function (paper) {

    paper.handlebars.registerHelper('cdn', function(assetPath) {
        var ret;

        if (/^(?:https?:)?\/\//.test(assetPath)) {
            return assetPath;
        }

        if (assetPath[0] !== '/') {
            assetPath = '/' + assetPath;
        }

        if (assetPath.substr(-4) === '.css') {
            ret = this.cdn_url_with_settings_hash + assetPath;
        } else {
            ret = this.cdn_url + assetPath;
        }

        return ret;
    });
};
