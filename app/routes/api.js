var bodyParser = require('body-parser');
//var schemas = require('../models/fixedplanning');
var config = require('../../config');
var winston = require('winston');
var Utils = require('./utils');

// var Recipes = schemas.Recipes;
// var FixedPlanning = schemas.FixedPlanning;
var ListaQuery = require('../models/lista_query');
var RecipeInPlan = require('../models/reteta_plan_query');
var addRecipe = require('./addRecipe');
var FlexibleList = require('../models/FlexibleList');

var db = require('mongojs')(config.database, ['recipes', 'fixed_planning', 'planning']);

var default_user = "website";

module.exports = function(app, express) {

    var apiRouter = express.Router();

    apiRouter.get('/', function(request, response) {
        response.json({
            message: 'Test Api route - Success.'
        });
    });

    // //Reteta subroute ---------------------------------------------------------------------------------------------------------------
    // // on routes that end in /reteta
    // apiRouter.route('/reteta')
    //     //get all recipes (accessed at GET base_url/api/reteta)
    //     .get(function(request, response) {
    //         winston.info("/reteta");
    //         Reteta.find({}, function(err, retete) {
    //             winston.info("find all retete", {
    //                 err: err
    //             });
    //             if (err) response.send(err);
    //             response.json(retete);
    //         });

    //     });
    // //check misspellings
    // apiRouter.route('/retete')
    //     .get(function(request, response) {
    //         response.json({
    //             message: '/retete path is undefined. Try using /reteta instead.',
    //             code: 100
    //         });
    //     });

    // apiRouter.route('/plan')
    //     //get all meal plans (accessed at GET base_url/api/plan)
    //     .get(function(request, response) {
    //         FixedPlanning.find({})
    //             .exec(function(err, planuri) {
    //                 if (err) response.send(err);
    //                 response.json(planuri);
    //             });
    //     });

    apiRouter.route('/plan/:year/:month/:day') //format yyyy/MM/dd, for first day of plan
        .get(function(request, response) {
            console.log('Here Route /plan/:year/:month/:day');
            db.fixed_planning.findOne({
                start_date: Utils.getDateFromString(request.params.year, request.params.month, request.params.day)
            }, function(err, plan) {
                console.log(request.params.year, request.params.month, request.params.day);
                if (err) response.send(err);
                if (!plan) {
                    response.json({
                        message: "Nici un plan pentru data ceruta.",
                        year: request.params.year,
                        month: request.params.month,
                        day: request.params.day,
                        code: 101
                    });
                } else
                    response.json(plan);
            });
        });
    apiRouter.route('/plan/:start_year/:start_month/:start_day/:end_year/:end_month/:end_day')
        .get(function(request, response) {
            // response.json('Custom start/end');
            console.log('start', Utils.getDateFromString(request.params.start_year, request.params.start_month, request.params.start_day));
            console.log('end', Utils.getDateFromString(request.params.end_year, request.params.end_month, request.params.end_day));
            db.planning.find({
                date: {
                    $gte: Utils.getDateFromString(request.params.start_year, request.params.start_month, request.params.start_day),
                    $lte: Utils.getDateFromString(request.params.end_year, request.params.end_month, request.params.end_day)
                }
            }, function(err, plan_array) {
                // console.log('plan_array', plan_array);
                response.json(plan_array);
            });
        });
    apiRouter.route('/plan/:start_year/:start_month/:start_day/:end_year/:end_month/:end_day/list')
        .get(function(request, response) {
            FlexibleList(db,
                response,
                request.params.start_year,
                request.params.start_month,
                request.params.start_day,
                request.params.end_year,
                request.params.end_month,
                request.params.end_day);
        });
    // apiRouter.route('/plan/:year/:month/:day/reteta/:recipe_name') //format yyyy/MM/dd,
    //     .get(function(request, response) {
    //         console.log('find reteta in plan');
    //         RecipeInPlan(db, response, request.params.year, request.params.month, request.params.day, request.params.recipe_name);
    //     });
    apiRouter.route('/plan/:year/:month/:day/recipe/:recipe_name') //format yyyy/MM/dd,
        .get(function(request, response) {
            console.log('find recipe in plan');
            // RecipeInPlan(db, response, request.params.year, request.params.month, request.params.day, request.params.recipe_name);
            var recipe = db.planning.findOne({
                "recipe._id": decodeURI(request.params.recipe_name).replace(/_/g, " "),
                date: new Date(request.params.year, request.params.month - 1, request.params.day)
            });
            response.json(recipe);
        });
    apiRouter.route('/plan/:year/:month/:day/lista')
        .get(function(request, response) {
            ListaQuery(db, request, response, request.params.year, request.params.month, request.params.day);
        });
    //check misspellings
    apiRouter.route('/planuri')
        .get(function(request, response) {
            //TODO json message
            response.send('/planuri path is undefined. Try using /plan instead.');
        });

    apiRouter.route('/admin/recipe')
        .put(function(request, response) {
            addRecipe(request, response, db, default_user);
        });

    apiRouter.route('/plan/last')
        .get(function(request, response) {
            db.fixed_planning.find({
                username: default_user
            }).sort({
                end_date: -1
            }).limit(1).forEach(function(err, doc) {
                if (err) console.log(err);
                if (!!doc) {
                    console.log('doc', doc);
                    console.log('dateToJson', Utils.dateToJson(new Date()));
                    response.json({
                        name: doc.name,
                        start_date: Utils.dateToJson(doc.start_date),
                        end_date: Utils.dateToJson(doc.end_date)
                    })
                }
            });
            // response.send('testing ok');
        });
    return apiRouter;
};
