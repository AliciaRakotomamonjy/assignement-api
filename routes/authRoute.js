const express = require("express");

var router = express.Router();

const utilisateurService = require("../services/utilisateurService");

router.route("/login").post(utilisateurService.Login);
// router.route("/inscription").post(utilisateurService.Inscription);


module.exports =router;


