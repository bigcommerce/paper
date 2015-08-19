module.exports = function (paper) {
    var jsContext = {};

    paper.handlebars.registerHelper('inject', function (key, value) {
        jsContext[key] = value;

        return '';
    });

    paper.handlebars.registerHelper('jsContext', function (options) {
        return new paper.handlebars.SafeString(JSON.stringify(JSON.stringify(jsContext)));
    });
};
