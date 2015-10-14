var _ = require('lodash'),
    internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    this.handlebars.registerHelper('getFontsUrl', function() {
        var regex = new RegExp(/\w+_font$/),
            url = '';

        _.each(context.theme_settings, function(value, key) {
            var pair;

            if (regex.test(key)) {
                pair = value.split('_');

                if (pair.length !== 2) {
                    return;
                }

                url += pair[0] + ':' + pair[1] + '|';
            }
        });

        return 'https://fonts.googleapis.com/css?family=' + url;
    });
};

module.exports = internals.implementation;
