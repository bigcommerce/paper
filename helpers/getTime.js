/*
** FUNCTION
** getTime()
** 
** DESCRIPTION (WHAT)
** A wrapper for the Javascript getTime function which returns the Unix timestamp for the current date-time
** 
** USE CASE (WHY)
** As a theme developer, I may want to compare the current time against a date returned by
** Stencil as part of the conditional logic used to display products on my storefront
** 
** USAGE
**
** {{#if (phpDateToTimestamp 'category.products[0].date_added.') > 
**       ((getTime) - theme_settings.new_product_lag)) }}
**      /* product is newer than the given time interval */
** {{/if}}
*/

'use strict';

function helper(paper) {
  paper.handlebars.registerHelper('getTime', function () {
      var d = new Date();
      return d.getTime();
  });
}

module.exports = helper;

