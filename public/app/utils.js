//get current week by starting date aka Monday
//return in format yyyy/MM/dd to query the API easier
var path = '/';
var daysPerWeek = 7; //days
var weekDays = {
    long: ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'],
    short: ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sa', 'Du']
};

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

Date.prototype.toJson = function() {
    return {
        year: this.getFullYear(),
        month: this.getMonth() + 1,
        day: this.getDate()
    }
}

var dateToPath = function(date) {
    return date.year + path + date.month + path + date.day;
}

var jsonToDate = function(dateJson) {
    return new Date(dateJson.year, dateJson.month, dateJson.day);
}

var currentMonday = function() {
    var today = new Date();
    var mondayAdjustement = (today.getDay() > 0) ? (-today.getDay() + 1) : -6; //adjust for week starting on Monday instead of Sunday
    today.addDays(mondayAdjustement);
    return today.toJson();
};

var nextMonday = function() {
    var thisMonday = currentMonday();
    var nextMondayDate = new Date(thisMonday.year, thisMonday.month - 1, thisMonday.day).addDays(daysPerWeek);
    console.log('nextMondayDate', dateToPath(nextMondayDate.toJson()));
    return dateToPath(nextMondayDate.toJson());
};

var getWeekDay = function(index, style) {
    if (style == 'l')
        return weekDays.long[index];
    else if (style == 's')
        return weekDays.short[index];
}

var getRecipeUrl = function(recipe_title) {
    if (!!recipe_title)
        return encodeURI(recipe_title.replace(/ /g, "_"));
    else return "";
}

var addToast = function(type, message) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr[type](message);
    console.log("toast launched");
}

//input {"0": "value0", "1": "value1", "2": "value2"}
var listToArray = function(list){
    var arr = [];
    _.each(list, function(item){
        arr.push(item);
    });
    console.log('listToArray', arr);
    return arr;
}