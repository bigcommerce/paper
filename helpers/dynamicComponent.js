var Path = require('path'),
    _ = require('lodash');


module.exports = function (paper) {
    paper.handlebars.registerHelper('dynamicComponent', function(componentsPath, prop) {
        var pathToPartial,
            partialTemplate;

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

        if (paper.handlebars.partials[pathToPartial]) {

            partialTemplate = paper.handlebars.partials[pathToPartial];

            return paper.handlebars.compile(partialTemplate, paper.options)(this);
        }
    });
};
