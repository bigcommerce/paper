module.exports = function (paper, handlebars) {

    handlebars.registerHelper('json', function (data) {
        return JSON.stringify(data);
    });
};
