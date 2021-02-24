'use strict';

const isObject = require('../lib/utils/isObject');

function helper(paper) {
    paper.handlebars.registerHelper('for', function (from, to, context) {
        const options = arguments[arguments.length - 1];
        const maxIterations = 100;
        let output = '';

        function isOptions(obj) {
            return obj && obj.fn;
        }

        if (isOptions(to)) {
            context = {};
            to = from;
            from = 1;
        } else if (isOptions(context) && isObject(to)) {
            context = to;
            to = from;
            from = 1;
        }

        if (to < from) {
            return;
        }

        from = parseInt(from, 10);
        to = parseInt(to, 10);

        if ((to - from) >= maxIterations) {
            to = from + maxIterations - 1;
        }

        for (let i = from; i <= to; i++) {
            context.$index = i;
            output += options.fn(context);
        }

        return output;
    });
}

module.exports = helper;
