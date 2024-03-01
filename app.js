var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const utilisateurRoute =require("./routes/utilisateurRoute");

require("./base/moongosedb");

const prefix = '/api';

app.use(prefix+"/utilisateur/",utilisateurRoute)


module.exports = app;
