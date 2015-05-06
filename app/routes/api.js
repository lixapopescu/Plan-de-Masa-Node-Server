var bodyParser = require('body-parser'); // get body-parser
var schemas = require('../models/retete');
// var Planuri = require('../models/planuri');
var config = require('../../config');
var winston = require('winston');

var Reteta = schemas.Reteta;
var Plan = schemas.Plan;




module.exports = function(app, express) {
    debugger;

    var apiRouter = express.Router();

    // test route to make sure everything is working 
    // accessed at GET http://localhost:8080/api
    apiRouter.get('/', function(req, res) {
        res.json({
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
                winston.info("find all retete", {err: err});
                if (err) response.send(err);
                response.json(retete);
            });

        });
    //check misspellings
    apiRouter.route('/retete')
        .get(function(request, response) {
            response.json({message: '/retete path is undefined. Try using /reteta instead.', code: 100});
        });

    apiRouter.route('/plan/:saptamana')
        //get meal plans (accessed at GET base_url/api/plan?saptamana=...)
        //return FIRST occurence (using findOne)
        .get(function(request, response) {
            Plan.findOne({
                    saptamana: request.params.saptamana
                })
                .exec(function(err, plan) {
                    console.log('Route /plan/:saptamana');
                    console.log(request.params.saptamana);
                    if (err) response.send(err);
                    if (!plan) {
                        console.log('No plan'.red);
                        response.json({
                            message: "Nici un plan pentru saptamana ceruta.",
                            saptamana: request.params.saptamana,
                            code: 101
                        });
                    } else
                        response.json(plan);
                });
        });
    apiRouter.route('/plan')
        //get all meal plans (accessed at GET base_url/api/plan)
        .get(function(request, response) {
            Plan.find({})
                .exec(function(err, planuri) {
                    console.log('Route /plan');
                    if (err) response.send(err);
                    response.json(planuri);
                });
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