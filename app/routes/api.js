var bodyParser = require('body-parser'); // get body-parser
var schemas = require('../models/retete');
// var Planuri = require('../models/planuri');
var config = require('../../config');
var winston = require('winston');
var Utils = require('./utils');

var Reteta = schemas.Reteta;
var Plan = schemas.Plan;
var ListaQuery = require('../models/lista_query');
var RecipeInPlan = require('../models/reteta_plan_query');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    // test route to make sure everything is working 
    // accessed at GET http://localhost:8080/api
    apiRouter.get('/', function(request, response) {
        response.json({
            message: 'Test Api route - Success.'
        });
    });

    //Reteta subroute ---------------------------------------------------------------------------------------------------------------
    // on routes that end in /reteta
    apiRouter.route('/reteta')
        //get all recipes (accessed at GET base_url/api/reteta)
        .get(function(request, response) {
            winston.info("/reteta");
            Reteta.find({}, function(err, retete) {
                winston.info("find all retete", {
                    err: err
                });
                if (err) response.send(err);
                response.json(retete);
            });

        });
    //check misspellings
    apiRouter.route('/retete')
        .get(function(request, response) {
            response.json({
                message: '/retete path is undefined. Try using /reteta instead.',
                code: 100
            });
        });

    apiRouter.route('/plan')
        //get all meal plans (accessed at GET base_url/api/plan)
        .get(function(request, response) {
            Plan.find({})
                .exec(function(err, planuri) {
                    if (err) response.send(err);
                    response.json(planuri);
                });
        });

    apiRouter.route('/plan/:an/:luna/:zi') //format yyyy/MM/dd, for first day of plan
        .get(function(request, response) {
            console.log('Here Route /plan/:an/:luna/:zi');
            Plan.findOne({
                    prima_zi: Utils.getDateFromString(request.params.an, request.params.luna, request.params.zi)
                })
                .exec(function(err, plan) {
                    console.log(request.params.an, request.params.luna, request.params.zi);
                    if (err) response.send(err);
                    if (!plan) {
                        response.json({
                            message: "Nici un plan pentru saptamana ceruta.",
                            saptamana: request.params.saptamana,
                            code: 101
                        });
                    } else
                        response.json(plan);
                });
        });
    apiRouter.route('/plan/:an/:luna/:zi/reteta/:recipe_name') //format yyyy/MM/dd,
        .get(function(request, response) {
            console.log('find reteta in plan');
            RecipeInPlan(response, request.params.an, request.params.luna, request.params.zi, request.params.recipe_name);
        });
    apiRouter.route('/plan/:an/:luna/:zi/lista')
        .get(function(request, response) {
            ListaQuery(request, response, request.params.an, request.params.luna, request.params.zi);
        });
    //check misspellings
    apiRouter.route('/planuri')
        .get(function(request, response) {
            //TODO json message
            response.send('/planuri path is undefined. Try using /plan instead.');
        });

    // apiRouter.route('/reteta/:reteta_nume')
    // .get(function(request, response));

    return apiRouter;
};
