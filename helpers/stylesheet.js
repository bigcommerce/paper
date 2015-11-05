var internals = {};
var _ = require('lodash');

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context, paper) {
    this.handlebars.registerHelper('stylesheet', function(assetPath, options) {
        var settings = context.settings || {};
        var url = paper.cdnify(assetPath, settings);
        var attrs = {
            rel: 'stylesheet'
        };

        // check if there is any extra attribute
        if (_.isObject(options.hash)) {
            attrs = _.merge(attrs, options.hash);
        }

        if (!attrs.id) {
            attrs.id = url;
        }
        
        attrs = _.map(attrs, function(value, key) {
            return key + '="' + value + '"';
        }).join(' ');


        return '<link data-stencil-stylesheet href="' + url + '" ' + attrs + '>';
    });
};

module.exports = internals.implementation;
