module.exports = function (paper, handlebars) {

    handlebars.registerHelper('toLowerCase', function(string) {

        if (typeof string !== 'string') {
            return string;
        }

        return string.toLowerCase();
    });
};
