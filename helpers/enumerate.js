module.exports = function (paper) {
    paper.handlebars.registerHelper('enumerate', function(start, end, options) {
        var out = '',
            i = start,
            iOut;

        for (i; i <= end; i++) {
            out = out + options.fn(i);
        }

        return out + '';
    });
};
