var bodyParser = require('body-parser'); // get body-parser
var User = require('../models/user');
// var jwt        = require('jsonwebtoken');
var config = require('../../config');
var colors = require('colors');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

    var apiRouter = express.Router();

    // test route to make sure everything is working 
    // accessed at GET http://localhost:8080/api
    apiRouter.get('/', function(req, res) {
        res.json({
            message: 'hooray! welcome to our api!'
        });
    });
    // on routes that end in /users
    // ----------------------------------------------------
    apiRouter.route('/users')
        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function(req, res) {
            User.find({}, function(err, users) {
                if (err) res.send(err);

                // return the users
                res.json(users);
            });
        });

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')
        // get the user with that id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);
                res.json(user);
            });
        });

    // api endpoint to get user information
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    return apiRouter;
};