function sameHeight(element1, element2) {
    var innerFooter = $(element1).find(".pricing-footer");

    $(element1).height($(element2).height());

    console.log($(element1).height());
    console.log($(element1).position().top);
    console.log(innerFooter.height());
    console.log(innerFooter.position().top);

    console.log($("#pricePlan1").height() - $("#pricePlan1").find(".pricing-footer").height());
    // $("#pricePlan1").find(".pricing-footer").position().css('top', $("#pricePlan1").height() - $("#pricePlan1").find(".pricing-footer").height());
    // $(element1).find(".pricing-footer").css('position', 'relative').css(
    //  'top', $(element1).height() - innerFooter.height()
    // );
}
$(document).ready(function() {
    sameHeight('#pricePlan1', '#pricePlan2');
});
// $("#pricePlan1").find(".type").position().top
// $("#pricePlan1").find(".pricing-footer").position().top = $("#pricePlan1").height() - $("#pricePlan1").find(".pricing-footer").height()

//http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};