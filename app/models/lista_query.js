// var schemas = require('./retete');
// var Plan = schemas.Plan;
var schemas = require('./fixedplanning');
var FixedPlanning = schemas.FixedPlanning;
var Utils = require('../routes/utils');

var getListaAggregate = function(request, response, an, luna, zi) { //based on year/month/day
    // console.log('generate static shopping list: ' + an + luna + zi + Utils.getDateFromString(an, luna, zi));
    FixedPlanning.aggregate({
                $unwind: "$days"
            }, {
                $unwind: "$days.daily_planning.recipe.ingredients"
            }, {
                $unwind: "$days.daily_planning.recipe.ingredients.list"
            }, {
                $match: {
                    start_date: Utils.getDateFromString(an, luna, zi)
                }
            },
            //unfold with no children
            {
                $project: {
                    name: "$days.daily_planning.recipe.ingredients.list.name",
                    quant: "$days.daily_planning.recipe.ingredients.list.quantity",
                    um: "$days.daily_planning.recipe.ingredients.list.um",
                    comment: "$days.daily_planning.recipe.ingredients.list.comment",
                    category: "$days.daily_planning.recipe.ingredients.list.category",
                    recipe_abbrev: "$days.abbrev",
                    recipe_id: "$days.daily_planning.recipe._id",
                    day_index: "$days.index"
                }
            },
            //group by categorie, nume, um
            {
                $group: {
                    "_id": {
                        cat: "$category",
                        ing: "$name",
                        um: "$um"
                    },
                    //comentarii: {$push: "$comentariu"},
                    recipe_abbrev: {
                        $addToSet: "$recipe_abbrev" //distinct values only. if not => error in angular
                    },
                    recipe_ids: {
                        $addToSet: "$recipe_id"
                    },
                    ingredient_comments: {
                        $addToSet: "$comment"
                    },
                    tot: {
                        $sum: "$quant"
                    }
                }
            },
            //replace "_id" with it's children
            {
                $project: {
                    "_id": false,
                    category: "$_id.cat",
                    ingredient: "$_id.ing",
                    total: "$tot",
                    um: "$_id.um",
                    recipe_abbrev: "$recipe_abbrev",
                    recipe_ids: "$recipe_ids",
                    ingredient_comments: "$ingredient_comments"
                }
            },
            //finally, group by main criteria, "$categorie"
            //and make custom element
            {
                $group: {
                    "_id": "$category",
                    ingredients: {
                        $push: {
                            "name": "$ingredient",
                            "total": "$total",
                            "um": "$um",
                            "recipe_abbrev": "$recipe_abbrev",
                            "recipe_ids": "$recipe_ids",
                            "ingredient_comments": "$ingredient_comments"
                        }
                    }
                }
            })
        .exec(function(err, lista) {
            // console.log('lista query', lista);
            if (err) response.json(err);
            else response.json(lista);
        });

};

module.exports = getListaAggregate;
