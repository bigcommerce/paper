module.exports = function (paper, handlebars) {
    // https://github.com/danharper/Handlebars-Helpers/blob/master/src/helpers.js#L89
    handlebars.registerHelper('nl2br', function(text) {
        var nl2br = (handlebars.escapeExpression(text) + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new handlebars.SafeString(nl2br);
    });
};
