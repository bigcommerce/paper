module.exports = function (paper) {

    paper.handlebars.registerHelper('inject', function (key, value) {
        if (typeof value === 'function') {
            return;
        }
        
        paper.inject[key] = value;
    });

    paper.handlebars.registerHelper('jsContext', function (options) {
        
        var jsContext = JSON.stringify(JSON.stringify(paper.inject));

        return new paper.handlebars.SafeString(jsContext);
    });
};
