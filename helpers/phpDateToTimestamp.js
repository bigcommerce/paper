'use strict';

/*
** FUNCTION
** phpDateToTimestamp(dateString)
** 
** DESCRIPTION (WHAT)
** The Stencil framework returns date strings using a PHP format of "M jS Y" in the
** page context. This function converts the string to milliseconds since Jan 1, 1970
** in order to make it easier to perform date comparisons and operations.
** 
** USE CASE (WHY)
** Some examples of how this would be used include the following story: As a merchant, 
** I want to display a carousel on my category pages that displays cards for products
** that were added to the catalog within the last month. In order to do that, I need
** to be able to convert the "date added" field that appears in the product cards under
** the category.products object. Likewise, the same behavior would apply to brand pages
** with products.
** 
** USAGE
**
** {{#if (phpDateToTimestamp 'category.products[0].date_added.') > 
**       ((getTime) - theme_settings.new_product_lag)) }}
**   // product is newer than the given time interval 
** {{/if}}
**
** and similarly with brands: 'brands.products[0].date_added.')
*/

function helper(paper) {
    paper.handlebars.registerHelper('phpDateToTimestamp', function (dateString) {
        if (typeof dateString !== 'string') {
            return 0;
        }
        var dateArray = dateString.split(" ");
        var month = 12;

        switch (dateArray[0]) {
        case "Jan":
            month = 0;
            break;
        case "Feb":
            month = 1;
            break;
        case "Mar":
            month = 2;
            break;
        case "Apr":
            month = 3;
            break;
        case "May":
            month = 4;
            break;
        case "Jun":
            month = 5;
            break;
        case "Jul":
            month = 6;
            break;    
        case "Aug":
            month = 7;
            break;
        case "Sep":
            month = 8;
            break;
        case "Oct":
            month = 9;
            break;
        case "Nov":
            month = 10;
            break;
        case "Dec":
            month = 11;
            break;
        }
        // remove english ordinal suffix: nd, rd, st, th
        var day = dateArray[1].replace(/[a-z]/g, "");
        var year = dateArray[2];
        var ts = new Date(year, month, day, 0, 0, 0);
        return ts.getTime();
    });
}

module.exports = helper;

