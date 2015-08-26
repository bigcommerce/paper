var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context, paper) {
    this.handlebars.registerHelper('lang', function(translationKey, options) {

        if (typeof paper.translations[translationKey] === 'function') {
            return paper.translations[translationKey](options.hash);
        }

        return translationKey;
    });
};

module.exports = internals.implementation;
