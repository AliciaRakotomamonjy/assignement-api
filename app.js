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
const { verifyToken } = require('./middleware/authentification');
const utilisateurRoute = require("./routes/utilisateurRoute");
const authRoute = require("./routes/authRoute");
const assignmenthRoute = require("./routes/assignmentRoute");
const matiereRoute = require("./routes/matiereRoute");
const assignmentEleveRoute = require("./routes/assignmentEleveRoute");

const staticOptions = {
  maxAge: '1y',
};
require("./base/moongosedb");
const prefix = '/api';
app.use(prefix + "/img", express.static("img", staticOptions));
app.use(prefix + "/", authRoute)
app.use(prefix + "/auth", authRoute)
app.use(verifyToken);
app.use(prefix + "/fichier_assignment_eleve", express.static("fichier_assignment_eleve", staticOptions));
app.use(prefix + "/assignment", assignmenthRoute)
app.use(prefix + "/matiere", matiereRoute)
app.use(prefix + "/utilisateur", utilisateurRoute)
app.use(prefix + "/assignmentEleve",assignmentEleveRoute)


module.exports = app;
