var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context, paper) {
    this.handlebars.registerHelper('cdn', function(assetPath) {
        var settings = context.settings || {};

        return paper.cdnify(assetPath, settings);
    });
};

module.exports = internals.implementation;
