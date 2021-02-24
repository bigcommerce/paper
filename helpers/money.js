'use strict';

/**
 * Format numbers
 *
 * @param {number} value
 * @param {number} n - length of decimal
 * @param {string} s - thousands delimiter
 * @param {string} c - decimal delimiter
 */
function numberFormat(value, n, s, c) {
    var re = '\\d(?=(\\d{3})+' + (n > 0 ? '\\D' : '$') + ')',
        num = value.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}

function helper(paper) {
    paper.handlebars.registerHelper('money', function (value) {
        const money = paper.settings.money;

        if (typeof value !== 'number') {
            return '';
        }

        value = numberFormat(
            value,
            money.decimal_places,
            money.thousands_token,
            money.decimal_token
        );

        return money.currency_location === 'left'
            ? money.currency_token + ' ' + value
            : value + ' ' + money.currency_token;
    });
}

module.exports = helper;
