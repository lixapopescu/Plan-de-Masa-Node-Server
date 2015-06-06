var Utils = require('../routes/utils');

var getFlexibleList = function(db, response, start_year, start_month, start_day, end_year, end_month, end_day) { //based on year/month/day
    db.planning.aggregate({
            $match: {
                date: {
                    $gte: Utils.getDateFromString(start_year, start_month, start_day),
                    $lte: Utils.getDateFromString(end_year, end_month, end_day)
                }
            }
        }, {
            $unwind: "$recipe.ingredients"
        }, {
            $unwind: "$recipe.ingredients.list"
        },
        //unfold with no children
        {
            $project: {
                name: "$recipe.ingredients.list.name",
                quant: "$recipe.ingredients.list.quantity",
                um: "$recipe.ingredients.list.um",
                comment: "$recipe.ingredients.list.comment",
                category: "$recipe.ingredients.list.category",
                recipe_id: "$recipe._id"
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
                        "recipe_ids": "$recipe_ids",
                        "ingredient_comments": "$ingredient_comments"
                    }
                }
            }
        },function(err, lista) {
            // console.log('lista query', lista);
            if (err) response.json(err);
            else response.json(lista);
        });

};

module.exports = getFlexibleList;
