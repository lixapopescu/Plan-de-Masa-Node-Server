var bodyParser = require('body-parser'); // get body-parser
var Retete = require('../models/retete');
var Planuri = require('../models/planuri');
var config = require('../../config');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    // test route to make sure everything is working 
    // accessed at GET http://localhost:8080/api
    apiRouter.get('/', function(req, res) {
        res.json({
            message: 'Test Api route - Success.'
        });
    });

    // on routes that end in /reteta
    apiRouter.route('/reteta')
        //get all recipes (accessed at GET base_url/api/reteta)
        .get(function(request, response) {
            Retete.find({}, function(err, retete) {
                if (err) response.send(err);
                response.json(retete);
            });

        });
    //check misspellings
    apiRouter.route('/retete')
        .get(function(request, response) {
            //TODO json message
            response.send('/retete path is undefined. Try using /reteta instead of /retete');
        });

    apiRouter.route('/plan')
        //get all meal plans (accessed at GET base_url/api/plan)
        .get(function(request, response) {
            Planuri.find({})
                .populate('retete')
                .exec(function(err, planuri) {
                    if (err) response.send(err);
                    console.log(planuri.retete);
                    response.json(planuri);
                });
        });

    return apiRouter;
};