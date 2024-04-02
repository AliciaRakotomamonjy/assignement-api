const express = require("express");
const multer = require('multer');
const upload = multer({
    dest: 'fichier_assignment_eleve/'
});
var router = express.Router();

const utilisateurService = require("../services/utilisateurService");

router.route("/fairedevoir").put(upload.any(),utilisateurService.FaireDevoir);

module.exports =router;


