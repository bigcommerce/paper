'use strict';

const utils = require('handlebars-utils');

function helper(paper) {
    paper.handlebars.registerHelper('unless', function () {
        const options = arguments[arguments.length - 1];
        arguments[arguments.length - 1] = Object.assign({}, options, {
            fn: options.inverse || (() => false),
            inverse: options.fn || (() => true),
            hash: options.hash
        });

        return paper.handlebars.helpers['if'].apply(this, arguments);
    });

    paper.handlebars.registerHelper('if', function (lvalue, operator, rvalue) {
        const options = arguments[arguments.length - 1];
        let result;

        // Only parameter
        if (utils.isOptions(operator)) {
            // If an array is passed as the only parameter
            if (utils.isArray(lvalue)) {
                result = !!lvalue.length;
            }
            // If an empty object is passed, treat as false
            else if (utils.isEmpty(lvalue) && utils.isObject(lvalue)) {
                result = false;
            }
            // Everything else
            else {
                result = !!lvalue;
            }
        } else {

            if (utils.isOptions(rvalue)) {
                // @TODO: this is block is for backwards compatibility with 'compare' helper
                // Remove after operator='==' is removed from stencil theme
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

            case 'gtnum':
                if (typeof lvalue === 'string' && typeof(rvalue) === 'string' && !isNaN(lvalue) && !isNaN(rvalue)) {
                    result = parseInt(lvalue) > parseInt(rvalue);
                } else {
                    throw new Error("if gtnum only accepts numbers (as strings)");
                }
                break;

            case 'typeof':
                result = (typeof lvalue === rvalue);
                break;

            default:
                throw new Error("Handlerbars Helper 'if' doesn't know the operator " + operator);
            }
        }

        if (!options.fn || !options.inverse) {
            options.fn = () => true;
            options.inverse = () => false;
        }

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
}

module.exports = helper;
