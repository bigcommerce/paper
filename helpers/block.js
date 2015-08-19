module.exports = function (paper) {
    paper.handlebars.registerHelper('block', function (name, options) {
        /* Look for partial by name. */
        var partial = paper.handlebars.partials[name] || options.fn;
        return partial(this, {data: options.hash});
    });
};
