var Path = require('path');
var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context, paper) {
    var self = this;

    self.handlebars.registerHelper('container', function(name) {
        var output = '';

        paper.containers = paper.containers || {};

        if (!paper.containers[name]) {
            return;
        }

        paper.containers[name].forEach(function (block) {

            var path = Path.join('content-blocks', block.type);

            if (self.handlebars.partials[path]) {
                output += self.handlebars.partials[path](block.data);
            }
        });

        return output;
    });
};

module.exports = internals.implementation;
