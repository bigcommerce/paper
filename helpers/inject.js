'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('inject', function (key, value, escape) {
        if (typeof value === 'function') {
            return;
        }
        function filterValues(value) {
            let result = value;
            try {
                JSON.parse(value);
            } catch (e) {
                if (typeof value === 'string') {
                    result = paper.handlebars.escapeExpression(value);
                }
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    result = filterObjectValues(value);
                }
                if (Array.isArray(value)) {
                    result = value.map(item => {
                        return filterValues(item);
                    });
                }
            }
            return result;
        }
        function filterObjectValues(obj) {
            let filteredObject = {};
            Object.keys(obj).forEach(key => {
                filteredObject[key] = filterValues(obj[key]);
            });
            return filteredObject;
        }
        
        if (typeof escape === 'object') {
            escape = false;
        }

        paper.inject[key] = escape ? filterValues(value) : value;
    });

    paper.handlebars.registerHelper('jsContext', function () {
        const jsContext = JSON.stringify(JSON.stringify(paper.inject));

        return new paper.handlebars.SafeString(jsContext);
    });
}

module.exports = helper;
