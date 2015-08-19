module.exports = function (paper) {
    paper.handlebars.registerHelper('ifCond', function (lvalue, operator, rvalue, options) {
        var operator,
            operators,
            result;

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
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
};
