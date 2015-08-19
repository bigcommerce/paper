/**
 * Escape html entities
 *
 * @param string html
 */
var escapeHtml = function (html) {
    var charsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;'
    };

    return function (html) {
        return html.replace(/[&<>"]/g, function (tag) {
            return charsToReplace[tag] || tag;
        });
    }
}();

module.exports = function (paper) {
    paper.handlebars.registerHelper('pre', function (value) {
        return '<pre>' + escapeHtml(JSON.stringify(value, null, 2)) + '</pre>';
    });
};
