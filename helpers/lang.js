var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context, paper) {
    this.handlebars.registerHelper('lang', function(translationKey, options) {
    	if (typeof paper.translate === 'function') {
        	return paper.translate(translationKey, options.hash);
        }
    });
};

module.exports = internals.implementation;
