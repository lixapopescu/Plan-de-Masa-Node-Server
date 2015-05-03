var config = require('./config');
var bodyParser = require('body-parser');
var morgan = require('morgan'); //used to see requests
var mongoose = require('mongoose');
var path = require('path');
var express = require('express');
var app = express();

var port = process.env.PORT || 8080; //the port for the app

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
