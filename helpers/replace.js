'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('replace', function (needle, haystack) {
        const options = arguments[arguments.length - 1];
        var contains = false;

        if (typeof(haystack) === 'string') {
            contains = haystack.indexOf(needle) > -1;
        }

        // Yield block if true
        if (contains) {
            return haystack.replace(new RegExp(needle, 'g'), options.fn(this));
        } else {
            return options.inverse(this);
        }
    });
}

module.exports = helper;
