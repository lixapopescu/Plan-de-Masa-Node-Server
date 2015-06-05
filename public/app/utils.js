//get current week by starting date aka Monday
//return in format yyyy/MM/dd to query the API easier
var path = '/';
var daysPerWeek = 7; //days
var weekDays = {
    long: ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata'],
    short: ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sa']
};
var weekDistanceLabels = {
    "-1": "ieri",
    "0": "azi",
    "1": "maine"
};
var millisecondsInDay = 86400000;

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

//compare day, month, year
Date.prototype.compare = function(day2) {
    if (!(day2 instanceof Date)) day2 = new Date(day2);
    // console.log('day2', day2);
    return (this.getDate() == day2.getDate()) && (this.getMonth() == day2.getMonth()) && (this.getFullYear() == day2.getFullYear());
}


var dateToPath = function(date) {
    return date.year + path + date.month + path + date.day;
}

var jsonToDate = function(dateJson) {
    return new Date(dateJson.year, dateJson.month, dateJson.day);
}

var jsonToPath = function(json) {
    var path = '';
    for (var property in json) {
        if (json.hasOwnProperty(property)) {
            // console.log(json[property]);
            path += '/' + json[property];
        }
    }
    return path;
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
var listToArray = function(list) {
    var arr = [];
    _.each(list, function(item) {
        arr.push(item);
    });
    console.log('listToArray', arr);
    return arr;
}
