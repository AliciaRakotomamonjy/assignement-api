var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
const cors = require('cors');
var bodyParser = require("body-parser");
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

const utilisateurRoute =require("./routes/utilisateurRoute");
const authRoute =require("./routes/authRoute");
const assignmenthRoute =require("./routes/assignmentRoute");

require("./base/moongosedb");

const prefix = '/api';
app.use(prefix+"/auth",authRoute)
require('./middleware/authentification')
app.use(prefix+"/utilisateur",utilisateurRoute)
app.use(prefix+"/assignment",assignmenthRoute)


module.exports = app;
