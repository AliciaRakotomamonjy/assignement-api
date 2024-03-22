const express = require("express");

var router = express.Router();

const matiereService = require("../services/matiereService");

router.route("/getAllMatiere").get(matiereService.GetAllMatiere);


module.exports =router;


