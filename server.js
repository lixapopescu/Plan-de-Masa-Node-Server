//"Plan de Masa" node server

//Configuration file
var config = require('./config');

//Imports 
var bodyParser = require('body-parser');
var morgan = require('morgan'); //used to see requests
// var mongoose = require('mongoose'); //for interaction with mongoDB
var path = require('path');
var express = require('express');
var passport = require('passport');
var favicon = require('serve-favicon');
var stylus = require('stylus');
// var FacebookStrategy = require('passport-facebook').Strategy;
// var passportLocalMongoose = require('passport-local-mongoose');
var methodOverride = require('method-override');
// var _=require('underscore');
//var Retete = require('./app/models/retete');
var mongojs = require('mongojs');  

//global variables
var app = express(); //new express node app
var port = config.port; //the port for the app
// var Schema = mongoose.Schema();


// APP CONFIGURATION ==================
// ====================================
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
app.set('port', config.port);
app.set('views', path.join(__dirname, 'app/views'));
//app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/assets/images/favicon.ico'));
app.use(morgan('dev'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(require('stylus').middleware(__dirname + '/public')); //In your html files, just include the .styl files, but use the css extension. Express will compile it from styl to css on the fly
app.use(express.static(__dirname + '/public'));

// DATABASE ===========================
// ====================================
// mongoose.connect(config.database);
// MongoClient.connect(config.database, function(err, new_db) {
//     assert.equal(null, err);
//     console.log("Connected correctly to server");
//     db = new_db;
//     // db.close();
// });
var collections= ["planning", "recipes"];
var db = mongojs(config.database, collections);

// ROUTES =============================
// ====================================
app.use('/mail', require('./app/routes/mail')(app, express));
app.use('/api', require('./app/routes/api')(app, express));
// app.use('/admin', require('./app/routes/admin')(app, express));

//get express to route angular routes 
app.use(function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendFile(__dirname + '/public/app/views/index.html');
});

// START THE SERVER
// ====================================
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
