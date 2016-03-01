var helper = function (handlebars) {
    this.handlebars = handlebars;
};

helper.prototype.register = function (context) {
    this.handlebars.registerHelper('helperMissing', function () {
    	return undefined;
    });
};

module.exports = helper;
