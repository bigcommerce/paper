module.exports = function (paper, handlebars) {
    handlebars.registerHelper('block', function (name, options) {
        /* Look for partial by name. */
        var partial = handlebars.partials[name] || options.fn;
        return partial(this, {data: options.hash});
    });
        
    handlebars.registerHelper('partial', function (name, options) {
        handlebars.registerPartial(name, options.fn);
    });
};
