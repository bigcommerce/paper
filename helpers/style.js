var internals = {};
var _ = require('lodash');

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context, paper) {
    this.handlebars.registerHelper('style', function(assetPath, options) {
        var settings = context.settings || {};
        var url = paper.cdnify(assetPath, settings);
        var attrs = '';

        // check if there is any extra attribute
        if (Object.getOwnPropertyNames(options.hash).length > 0) {
            attrs = ' ' + _.map(options.hash, function(value, key) {
                return key + '="' + value + '"';
            }).join(" ");
        }

        return '<link data-stencil-style href="' + url + '"' + attrs + '>';
    });
};

module.exports = internals.implementation;
