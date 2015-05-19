var getDateFromString = function(year, month, day) {
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

module.exports.getDateFromString = getDateFromString;