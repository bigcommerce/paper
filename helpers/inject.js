module.exports = function (paper, handlebars) {

    handlebars.registerHelper('inject', function (key, value) {
        if (typeof value === 'function') {
            return;
        }

        paper.inject[key] = value;
    });

    handlebars.registerHelper('jsContext', function (options) {

        var jsContext = JSON.stringify(JSON.stringify(paper.inject));

        return new handlebars.SafeString(jsContext);
    });
};
