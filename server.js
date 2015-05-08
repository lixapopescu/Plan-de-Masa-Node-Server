//"Plan de Masa" node server


//Configuration file
var config = require('./config');

//Imports 
var bodyParser = require('body-parser');
var morgan = require('morgan'); //used to see requests
var mongoose = require('mongoose'); //for interaction with mongoDB
var path = require('path');
var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
//var Retete = require('./app/models/retete');


//global variables
var app = express(); //new express node app
var port = config.port; //the port for the app
var Schema = mongoose.Schema();


// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// log all requests to the console 
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)		
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

//http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/#.VUdnhie1Gko
//--------------
// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(passport.initialize());
// app.use(passport.session());
///---------

// ROUTES FOR AUTHENTICATION =================
// ===========================================
//based on tutorial on http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/#.VUdnhie1Gko
// serialize and deserialize
// passport.serializeUser(function(user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function(obj, done) {
//     done(null, obj);
// });


// passport.use(new FacebookStrategy({
//         clientID: config.facebook.clientID,
//         clientSecret: config.facebook.clientSecret,
//         callbackURL: config.facebook.callbackURL
//     },
//     function(accessToken, refreshToken, profile, done) {
//         process.nextTick(function() {
//             return done(null, profile);
//         });
//     }
// ));

// ROUTES FOR OUR API =================
// ====================================

// MAIL ROUTES ------------------------
var mailRoutes = require('./app/routes/mail')(app, express);
app.use('/mail', mailRoutes);


// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

app.get('/plan_detalii.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/plan_detalii.html'));
});

/*app.get('/teste', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/pages_teste/'));
});
*/// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
app.get('/teste', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/teste.html'));
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
