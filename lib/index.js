var _ = require('lodash'),
    Handlebars = require('handlebars'),
    Hoek = require('hoek'),
    Localizer = require('./localizer'),
    Path = require('path'),
    internals = {
        handlebarsOptions: {
            preventIndent: true
        }
    };

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
        return Handlebars.compile(Handlebars.partials[partialName], internals.handlebarsOptions)(context);
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
    var jsContext = {};

    Handlebars.registerHelper('cdn', function(assetPath) {
        var ret;

        if (assetPath[0] !== '/') {
            assetPath = '/' + assetPath;
        }

        if (assetPath.substr(-4) === '.css') {
            ret = context.cdn_url_with_settings_hash + assetPath;
        } else {
            ret = context.cdn_url + assetPath;
        }

        return ret;
    });

    Handlebars.registerHelper('inject', function (key, value) {
        jsContext[key] = value;

        return '';
    });

    Handlebars.registerHelper('jsContext', function (options) {
        return new Handlebars.SafeString(JSON.stringify(JSON.stringify(jsContext)));
    });

    Handlebars.registerHelper('block', function (name, options) {
        /* Look for partial by name. */
        var partial = Handlebars.partials[name] || options.fn;
        return partial(this, {data: options.hash});
    });

    Handlebars.registerHelper('partial', function (name, options) {
        Handlebars.registerPartial(name, options.fn);
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

    Handlebars.registerHelper('getImage', function (image, preset, defaultImage) {
        var presets = context.theme_images || {},
            width,
            height,
            size,
            url;

        if (!_.isObject(image)) {
            return _.isString(image) ? image : defaultImage;
        }

        url = image.data || '';

        if (_.isObject(presets[preset])) {
            width = presets[preset].width || 100;
            height = presets[preset].height || 100;
            size = width + 'x' + height;
        } else {
            size = 'original';
        }

        return url.replace('{:size}', size);
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
        };

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

    // https://github.com/danharper/Handlebars-Helpers/blob/master/src/helpers.js#L89
    Handlebars.registerHelper('nl2br', function(text) {
        var nl2br = (Handlebars.escapeExpression(text) + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new Handlebars.SafeString(nl2br);
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

    Handlebars.registerHelper('for', function(from, to, context, options) {
        var output = '',
            maxIterations = 100;

        if (_.isObject(to)) {
            options = context;
            context = to;
            to = from;
            from = 1;
        }

        context = context || {};

        if (from < 0 || from > 1) {
            throw new Error("the parameter 'from' can only be 0 or 1");
        }
        
        // limit the number of iterations
        to = to > maxIterations
            ? maxIterations
            : to;

        for (var i = from; i < to + 1; i += 1) {
            context.$index = i;
            output += options.fn(context);
        }

        return output;
    });

    Handlebars.registerHelper('dynamicComponent', function(componentsPath, prop) {
        var pathToPartial;

        if (! _.isString(prop)) {
            prop = 'partial';
        }

        if (! this[prop]) {
            return '';
        }

        // We don't want a slash as a prefix
        if (componentsPath[0] === '/') {
            componentsPath = componentsPath.substr(1);
        }

        pathToPartial = Path.join(componentsPath, this[prop]);

        return internals.renderPartial(pathToPartial, this);
    });

    Handlebars.registerHelper('replace', function(needle, haystack, options) {
        var contains = haystack.indexOf(needle) > -1;

        // Yield block if true
       if (contains) {
            return haystack.replace(needle, options.fn(this));
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('toLowerCase', function(string) {
      return string.toLowerCase();
    });

    Handlebars.registerHelper('pluck', function(collection, path) {
        return _.pluck(collection, path);
    });

    Handlebars.registerHelper('join', function(array, separator, options) {
        var config = options.hash || {};

        array = array.slice();

        // Truncate array
        if (config.limit && array.length > config.limit) {
            array = array.slice(0, config.limit);
        }

        // Use lastSeparator between last and second last item, if provided
        if (config.lastSeparator) {
            var truncatedArray = array.slice(0, -1),
                lastItem = array.slice(-1);

            return truncatedArray.join(separator) + config.lastSeparator + lastItem;
        }

        return array.join(separator);
    });

    Handlebars.registerHelper('pick', function(object, predicate) {
        return _.pick.apply(null, arguments);
    });

    /**
     * Yield block if any object within a collection matches supplied predicate
     *
     * @example
     * {{#any items selected=true}} ... {{/any}}
     */
    Handlebars.registerHelper('any', function(collection, options) {
        var predicate = options.hash,
            any = _.any(collection, predicate);

        if (any) {
            return options.fn(this);
        }

        return options.inverse(this);
    });

    /**
     * Is any value included in a collection or a string?
     *
     * @example
     * {{#contains fonts "Roboto"}} ... {{/contains}}
     * {{#contains font_path "Roboto"}} ... {{/contains}}
     */
    Handlebars.registerHelper('contains', function(value, targetValue) {
        var args = Array.prototype.slice.call(arguments, 0, -1),
            options = _.last(arguments),
            contained = _.contains.apply(_, args);

        // Yield block if true
        if (contained) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    /**
     * Concats two values, primarily used as a subhelper
     * @example
     *  {{@lang (concat 'products.reviews.rating.' this) }}
     */
    Handlebars.registerHelper('concat', function (value, otherValue) {
        return new Handlebars.SafeString(value + otherValue);
    })

    /**
     * Set the last item of an array as context
     *
     * @example
     * {{#last items}} {{title}} {{/last}}
     */
    Handlebars.registerHelper('last', function (array, options) {
        return options.fn(_.last(array));
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
        compiled;

    if (typeof callback === 'function') {
        callback = Hoek.nextTick(callback);
    }

    try {
        internals.loadHelpers(context, translations);
        internals.registerPartials(source);

        template = Handlebars.compile(source[mainTemplate], internals.handlebarsOptions);
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
