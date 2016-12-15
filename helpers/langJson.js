'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('langJson', function (keyFilter) {
        if (!paper.translator) {
            return '{}';
        }

        return JSON.stringify({
            locale: paper.translator.getLocaleName(),
            translation: paper.translator.getTranslation(keyFilter),
        });
    });
}

module.exports = helper;
