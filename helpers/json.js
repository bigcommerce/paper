module.exports = function (paper) {

    paper.handlebars.registerHelper('json', function (data) {
        return JSON.stringify(data);
    });
};
