module.exports = function (paper, handlebars) {
    handlebars.registerHelper('lang', function(translationKey, options) {

        if (typeof paper.translations[translationKey] === 'function') {
            return paper.translations[translationKey](options.hash);
        }

        return translationKey;
    });
};
