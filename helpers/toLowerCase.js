module.exports = function (paper) {

    paper.handlebars.registerHelper('toLowerCase', function(string) {

        if (typeof string !== 'string') {
            return string;
        }

        return string.toLowerCase();
    });
};
