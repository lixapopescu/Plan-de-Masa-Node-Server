var bodyParser = require('body-parser'); // get body-parser
//var User       = require('../models/user');
var config = require('../../config');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(app, express) {
    var authRouter = express.Router();

    // Redirect the user to Facebook for authentication.  When complete,
    // Facebook will redirect the user back to the application at
    //     /auth/facebook/callback
    app.get('/auth/facebook', passport.authenticate('facebook'));

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));
};