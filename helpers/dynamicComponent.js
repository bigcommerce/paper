var Path = require('path'),
    _ = require('lodash');

module.exports = function (paper, handlebars) {
    handlebars.registerHelper('dynamicComponent', function(path) {
        var template;

        if (!this['partial']) {
            return;
        }

        // prevent access to __proto__ 
        // or any hidden object properties
        path = path.replace('__', '');

        // We don't want a slash as a prefix
        if (path[0] === '/') {
            path = path.substr(1);
        }

        path = Path.join(path, this['partial']);

        if (handlebars.partials[path]) {

            template = handlebars.partials[path];

            return handlebars.compile(template, paper.options)(this);
        }
    });
};
