module.exports = function (paper) {
    paper.handlebars.registerHelper('equals', function (val1, val2, options) {
        if (val1 != val2) {
            return '';
        }

        return options.fn();
    });
};
