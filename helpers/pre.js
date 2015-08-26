module.exports = function (paper, handlebars) {
    
    handlebars.registerHelper('pre', function (value) {
        var string = JSON.stringify(value, null, 2);

        string = handlebars.Utils.escapeExpression(string);

        return '<pre>' + string + '</pre>';
    });
};
