var getDateFromString = function(year, month, day) {
    return new Date(parseInt(year), parseInt(month), parseInt(day));
}

module.exports.getDateFromString = getDateFromString;