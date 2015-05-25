var schemas = require('./retete');
var Plan = schemas.Plan;
var Utils = require('../routes/utils');

var getRecipeInPlan = function(response, year, month, day, recipe_name_underscore) {
    console.log(year, month, day, recipe_name_underscore);
    Plan.aggregate([{
            $match: {
                prima_zi: new Date(year, month - 1, day)
            }
        }, {
            $unwind: "$zile"
        }, {
            $project: {
                reteta: "$zile.retete",
                reteta_nume: "$zile.retete.nume",
                zi_nume: "$zile.nume",
                abreviatie: "$zile.abreviatie",
                pinterest_url: "$zile.pinterest_url"
            }
        }, {
            $match: {
                reteta_nume: recipe_name_underscore.replace(/_/g, " ")
            }
        }])
        .exec(function(err, reteta) { 
            if (err) response.json(err);
            else response.json(reteta);
        });

}

module.exports = getRecipeInPlan;