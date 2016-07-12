var internals = {};

internals.implementation = function (handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function (paper) {
    var self = this;

    this.handlebars.registerHelper('inject', function (key, value) {
        if (typeof value === 'function') {
            return;
        }

        paper.inject[key] = value;
    });

    this.handlebars.registerHelper('jsContext', function () {

        var jsContext = JSON.stringify(JSON.stringify(paper.inject));

        return new self.handlebars.SafeString(jsContext);
    });
};

module.exports = internals.implementation;
