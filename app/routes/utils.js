var getDateFromString = function(year, month, day) {
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}


// dd/MM/yyyy => Date
var getDateFromStringFull = function(dateString){
    var s = dateString.split("/");
    return getDateFromString(s[2], s[1], s[0]);
}

module.exports = {
	getDateFromString: getDateFromString,
	getDateFromStringFull: getDateFromStringFull
}