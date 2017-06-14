'use strict';

function helper(paper) {
    paper.handlebars.registerHelper('region', function (params) {
        let regionId = params.hash.name;
        let content = '';

        if (!paper.renderingContext || !paper.renderingContext.regions) {
            return '';
        }

        if (paper.renderingContext.regions[regionId]) {
            content = `<div data-content-region="${regionId}">${paper.renderingContext.regions[regionId]}</div>`;
        }

        return new paper.handlebars.SafeString(content);
    });
}

module.exports = helper;
