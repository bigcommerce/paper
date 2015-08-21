var _ = require('lodash');

module.exports = function (paper) {

    function isOptions(obj) {
        return _.isObject(obj) && obj.fn;
    }

    paper.handlebars.registerHelper('if', function (lvalue, operator, rvalue, options) {
        var operator,
            operators,
            result;

        if (isOptions(operator)) {
            options = operator;
            result = lvalue;
        } else {

            if (isOptions(rvalue)) {
                options = rvalue;
                rvalue = operator;
                operator = options.hash.operator || "==";
            }

            switch (operator) {
                case '==':
                    result = (lvalue == rvalue);
                    break;

                case '===':
                    result = (lvalue === rvalue);
                    break;

                case '!=':
                    result = (lvalue != rvalue);
                    break;

                case '!==':
                    result = (lvalue !== rvalue);
                    break;

                case '<':
                    result = (lvalue < rvalue);
                    break;

                case '>':
                    result = (lvalue > rvalue);
                    break;

                case '<=':
                    result = (lvalue <= rvalue);
                    break;

                case '>=':
                    result = (lvalue >= rvalue);
                    break;

                case 'typeof':
                    result = (typeof lvalue === rvalue);
                    break;

                default:
                    throw new Error("Handlerbars Helper 'if' doesn't know the operator " + operator);
            }
        }

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
};
