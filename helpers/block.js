var internals = {};

internals.implementation = function(handlebars) {
    this.handlebars = handlebars;
};

internals.implementation.prototype.register = function(context) {
    var self = this;

    this.handlebars.registerHelper('block', function (name, options) {
        /* Look for partial by name. */
        var partial = self.handlebars.partials[name] || options.fn;
        return partial(this, {data: options.hash});
    });
        
    this.handlebars.registerHelper('partial', function (name, options) {
        self.handlebars.registerPartial(name, options.fn);
    });
};

module.exports = internals.implementation;
