'use strict';
const utils = require('handlebars-utils');
const max_length = 1024;
const max_keys = 50;

function helper(paper) {
    paper.handlebars.registerHelper('getVar', function (key) {
        if (!utils.isString(key)) {
            throw new Error("getVar helper key must be a string");
        }

        return paper.variables[key]
    });

    paper.handlebars.registerHelper('assignVar', function (key, value) {
        // Validate that key is a string
        if (!utils.isString(key)) {
            throw new Error("assignVar helper key must be a string");
        }

        // Validate that value is a string or integer
        if (!utils.isString(value) && !Number.isInteger(value)) {
            throw new Error("assignVar helper value must be a string or a number (integer)");
        }

        // Validate that string is not longer than the max length
        if (utils.isString(value) && value.length >= max_length) {
            throw new Error(`assignVar helper value must be less than ${max_length} characters, 
                but a ${value.length} character value was set to ${key}`);
        }

        // Make sure the number of total keys is within the limit
        if (Object.keys(paper.variables).length >= max_keys) {
            throw new Error(`Unique keys in variable storage may not exceed ${max_keys} in total`);
        }

        // Store value for later use by getVar helper
        paper.variables[key] = value;
    });

    paper.handlebars.registerHelper('incrementVar', function (key) {
        if (!utils.isString(key)) {
            throw new Error("incrementVar helper key must be a string");
        }

        if (Number.isInteger(paper.variables[key])) {
            // Increment value if it already exists
            paper.variables[key] += 1;
        } else {
            // Make sure the number of total keys is within the limit
            if (Object.keys(paper.variables).length >= max_keys) {
                throw new Error(`Unique keys in variable storage may not exceed ${max_keys} in total`);
            }
            // Initialize or re-initialize value
            paper.variables[key] = 0;
        }

        // Return current value
        return paper.variables[key];
    });

    paper.handlebars.registerHelper('decrementVar', function (key) {
        if (!utils.isString(key)) {
            throw new Error("decrementVar helper key must be a string");
        }

        if (Number.isInteger(paper.variables[key])) {
            // Decrement value if it already exists
            paper.variables[key] -= 1;
        } else {
            // Make sure the number of total keys is within the limit
            if (Object.keys(paper.variables).length >= max_keys) {
                throw new Error(`Unique keys in variable storage may not exceed ${max_keys} in total`);
            }
            // Initialize or re-initialize value
            paper.variables[key] = 0;
        }

        // Return current value
        return paper.variables[key];
    });
}

module.exports = helper;
