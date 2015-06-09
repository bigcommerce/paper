var _ = require('lodash'),
    Handlebars = require('handlebars'),
    Hoek = require('Hoek'),
    Localizer = require('./localizer'),
    internals = {};

/**
 * Registers all the resolved partials
 *
 * @param {Object} loadedTemplates
 */
internals.registerPartials = function (loadedTemplates) {
    _.forOwn(loadedTemplates, function (content, fileName) {
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
 * Escape html entities
 *
 * @param string html
 */
internals.escapeHtml = function (html) {
    var charsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;'
    };

    return function (html) {
        return html.replace(/[&<>"]/g, function (tag) {
            return charsToReplace[tag] || tag;
        });
    }
}();

/**
 * Format numbers
 *
 * @param integer n: length of decimal
 * @param mixed   s: thousands delimiter
 * @param mixed   c: decimal delimiter
 */
internals.numberFormat = function (value, n, s, c) {
    var re = '\\d(?=(\\d{3})+' + (n > 0 ? '\\D' : '$') + ')',
        num = value.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

/**
 * Load up common handlebars helper methods
 */
internals.loadHelpers = function (context, translations) {
    Handlebars.registerHelper('block', function (name, options) {
        /* Look for partial by name. */
        var partial = Handlebars.partials[name] || options.fn;
        return partial(this, {data: options.hash});
    });

    Handlebars.registerHelper('partial', function (name, options) {
        Handlebars.registerPartial(name, options.fn);
    });

    Handlebars.registerHelper('renderProductOption', function (productOption) {
        var partialName = productOption.partial;

        return internals.renderPartial(partialName, productOption);
    });

    Handlebars.registerHelper('renderProductCustomization', function (customization) {
        var partialName = customization.partial;

        return internals.renderPartial(partialName, customization);
    });

    Handlebars.registerHelper('getShortMonth', function (index) {

        switch (index) {
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

    Handlebars.registerHelper('reviews', function (avgReview, filled, empty) {
        var i,
            output = '',
            ceil = Math.ceil(avgReview);

        // append filled stars
        for (i = 0; i < ceil; i++) {
            output += filled;
        }

        // append empty stars
        while (i < 5) {
            output += empty;
            i++;
        }

        return new Handlebars.SafeString(output);
    });

    Handlebars.registerHelper('equals', function (val1, val2, options) {
        if (val1 != val2) {
            return '';
        }

        return options.fn();
    });

    Handlebars.registerHelper('compare', function (lvalue, rvalue, options) {
        var operator,
            operators,
            result;

        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        operator = options.hash.operator || "==";

        operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        }

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });


    Handlebars.registerHelper('money', function (value) {
        var money = context.settings.money;

        if (!_.isNumber(value)) {
            return '';
        }

        value = internals.numberFormat(
            value,
            money.decimal_places,
            money.thousands_token,
            money.decimal_token
        );

        return money.currency_location === 'left'
            ? money.currency_token + ' ' + value
            : value + ' ' + money.currency_token;
    });

    Handlebars.registerHelper('json', function (data) {
        return JSON.stringify(data);
    });

    Handlebars.registerHelper('pre', function (value) {
        return '<pre>' + internals.escapeHtml(JSON.stringify(value, null, 2)) + '</pre>';
    });

    Handlebars.registerHelper('lang', function(translationKey, options) {
        if (translations && translations[translationKey]) {
            return translations[translationKey](options.hash);
        }

        return translationKey;
    });

    Handlebars.registerHelper('enumerate', function(start, end, options) {
        var out = '',
            i = start,
            iOut;

        for (i; i <= end; i++) {
            out = out + options.fn(i);
        }

        return out + '';
    });

    Handlebars.registerHelper('field', function(formContext){
        return internals.renderPartial(formContext.partial, formContext);
    });
};

/**
 * Wrapper for the handlebars compile function
 * This is the async version
 *
 * @param {String} mainTemplate
 * @param {Object} source
 * @param {Object} context
 * @param {Object} translations
 * @param {Function} callback
 * @return {Object}
 */
exports.compile = function (mainTemplate, source, context, translations, callback) {
    var template,
        compiled,
        callback = (typeof callback === 'function') ? Hoek.nextTick(callback) : undefined;

    try {
        internals.loadHelpers(context, translations);
        internals.registerPartials(source);
        
        template = Handlebars.compile(source[mainTemplate]);
        compiled = template(context);

        if (!compiled) {
            throw new Error("Empty content");
        }

    } catch (e) {
        if (callback) {
            return callback(e);
        } else {
            throw e;
        }
    }

    if (callback) {
        callback(null, compiled);
    }

    return compiled;
};

/**
 * Compiles translation JSON files with messageformat.js
 * @param rootLocale
 * @param translations
 * @returns {*}
 */
exports.compileTranslations = function (rootLocale, translations) {
    return Localizer.compileTranslations(rootLocale, translations);
};
