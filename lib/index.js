var _ = require('lodash'),
    Handlebars = require('handlebars'),
    internals = {};

/**
 * Registers all the resolved partials
 *
 * @param {Object} loadedTemplates
 */
internals.registerPartials = function(loadedTemplates) {
    _.forOwn(loadedTemplates, function(content, fileName) {
        Handlebars.registerPartial(fileName, content);
    });
};

internals.renderPartial = function (partialName, context) {
    if (Handlebars.partials[partialName]) {
        return Handlebars.compile(Handlebars.partials[partialName])(context);
    }

    return '';
};

/**
 * Load up common handlebars helper methods
 */
internals.loadHelpers = function () {
    Handlebars.registerHelper('block', function (name, options) {
        /* Look for partial by name. */
        var partial = Handlebars.partials[name] || options.fn;
        return partial(this, {data: options.hash});
    });

    Handlebars.registerHelper('partial', function (name, options) {
        Handlebars.registerPartial(name, options.fn);
    });

    Handlebars.registerHelper('scripts', function (name, options) {
        return 'load scripts for ' + name + ' here';
    });


    Handlebars.registerHelper('renderProductOption', function(productOption) {
        var partialName = productOption.partial;

        return internals.renderPartial(partialName, productOption);
    });

    Handlebars.registerHelper('renderProductCustomization', function(customization) {
        var partialName = customization.partial;

        return internals.renderPartial(partialName, customization);
    });

    Handlebars.registerHelper('getShortMonth', function(index) {

        switch(index) {
            case 1:
                return 'Jan';
            case 2:
                return 'Feb';
            case 3:
                return 'Mar';
            case 4:
                return 'Apr';
            case 5:
                return 'May';
            case 6:
                return 'Jun';
            case 7:
                return 'Jul';
            case 8:
                return 'Aug';
            case 9:
                return 'Sep';
            case 10:
                return 'Oct';
            case 11:
                return 'Nov';
            case 12:
                return 'Dec';
        }

        return '';
    });

    Handlebars.registerHelper('equals', function(val1, val2, options) {
        if (val1 != val2) {
            return '';
        }

        return options.fn();
    });

    Handlebars.registerHelper('enumerate', function(start, end, options) {
        var out = '',
            i = start,
            iOut;

        for(i; i <= end; i++) {
            out = out + options.fn(i);
        }

        return out + '';
    });
};

/**
 * Wrapper for the handlebars compile function
 *
 * @param {String} mainTemplate
 * @param {Object} source
 * @param {Object} context
 * @return {Object}
 */
exports.compile = function(mainTemplate, source, context) {
    var template;

    internals.loadHelpers();
    internals.registerPartials(source);
    template = Handlebars.compile(source[mainTemplate]);
    return template(context);
};
