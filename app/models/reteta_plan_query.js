var schemas = require('./fixedplanning');
var FixedPlanning = schemas.FixedPlanning;
var Utils = require('../routes/utils');

var getRecipeInPlan = function(response, year, month, day, recipe_name_underscore) {
    console.log(year, month, day, recipe_name_underscore);
    FixedPlanning.aggregate([{
            $match: {
                start_date: new Date(year, month - 1, day)
            }
        }, {
            $unwind: "$days"
        }, {
            $project: {
                recipe: "$days.daily_planning.recipe",
                recipe_name: "$days.daily_planning.recipe._id",
                day_index: "$days.daily_planning.index",
                abbrev: "$days.daily_planning.abbrev",
                pinterest_url: "$days.daily_planning.pinterest_url"
            }
        }, {
            $match: {
                recipe_name: recipe_name_underscore.replace(/_/g, " ")
            }
        }])
        .exec(function(err, reteta) { 
            if (err) response.json(err);
            else response.json(reteta);
        });

}

module.exports = getRecipeInPlan;