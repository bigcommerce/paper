module.exports = function (paper) {
    paper.handlebars.registerHelper('replace', function(needle, haystack, options) {
        var contains = haystack.indexOf(needle) > -1;

        // Yield block if true
        if (contains) {
            return haystack.replace(new RegExp(needle, 'g'), options.fn(this));
        } else {
            return options.inverse(this);
        }
    });
};
