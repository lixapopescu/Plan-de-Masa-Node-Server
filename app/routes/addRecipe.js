var Utils = require('./utils');

var saveFixedPlanning = function(db, f, dailyPlanningWithId) {
    db.collection('fixed_planning').findOne({
        "name": f.name
            // start_date: Utils.getDateFromStringFull(f.start_date),
            // end_date: Utils.getDateFromStringFull(f.end_date)
    }, function(err, document) {
        var fixed_plan = document;
        console.log('inside func', err, document);

        console.log('f.name', f.name);
        console.log("fixed_plan", fixed_plan);
        console.log("dailyPlanningWithId", dailyPlanningWithId);
        if (!!fixed_plan) {
            //update existing fixed_plan
            console.log('update existing fixed_plan ', fixed_plan._id, fixed_plan.start_date);
            db.fixed_planning.update({
                _id: fixed_plan._id
            }, {
                $addToSet: {
                    days: {
                        index: f.index,
                        abbrev: f.abbrev,
                        pinterest_url: f.pinterest_url,
                        daily_planning: dailyPlanningWithId
                    }
                }
            });
        } else {
            //insert new fixed_plan
            console.log('insert new fixed_plan ', f.name);
            db.fixed_planning.insert({
                username: default_user,
                name: f.name,
                start_date: Utils.getDateFromStringFull(f.start_date),
                end_date: Utils.getDateFromStringFull(f.end_date),
                pinterest_url: f.pinterest_url,
                created: {
                    user: default_user,
                    date: new Date()
                },
                days: [{
                    index: f.index,
                    abbrev: f.abbrev,
                    pinterest_url: f.pinterest_url,
                    daily_planning: dailyPlanningWithId
                }]
            });
        }
    });
}

var addRecipe = function(request, response, db, default_user) {
    var r = request.body.recipe;
    // if (!r._id) {
    //TODO: error handeling
    // }

    if (!r.username) {
        r.username = default_user;
    }
    if (!r.created) {
        r.created = {};
        r.created.user = default_user;
        r.created.date = new Date();
    }
    if (!r.modified) {
        r.modified = {};
        r.modified.user = default_user;
    }
    if (r.modified) {
        r.modified.date = new Date();
    }
    db.recipes.save(r);

    console.log('request.body.day', request.body.day);

    if (request.body.day) {
        var d = request.body.day;
        d.recipe = r;
        if (!d.username) {
            d.username = default_user;
        }
        if (!d.created) {
            d.created = {};
            d.created.user = default_user;
            d.created.date = new Date();
        }
        if (!d.modified) {
            d.modified = {};
            d.modified.user = default_user;
        }
        if (d.modified) {
            d.modified.date = new Date();
        }
        if (d.dateString) {
            d.date = Utils.getDateFromStringFull(d.dateString);
            console.log('new date', d.date);
        }
        db.planning.save(d);

        // console.log('d', d);
        console.log('request.body.fixed', request.body.fixed);

        if (request.body.fixed) {
            var f = request.body.fixed;

            db.planning.findOne({
                date: d.date
            }, function(err, document) {
                var dailyPlanningWithId = document;
                console.log('inside1', err, document);
                saveFixedPlanning(db, f, dailyPlanningWithId);
            });

        }

        response.json({
            recipe: request.body.recipe._id
        });
    };

}

module.exports = addRecipe;
