const express = require("express");

var router = express.Router();

const assignmentService = require("../services/assignmentService");

router.route("/getAllAssignment").get(assignmentService.GetAllAssignment);
router.route("/ajouterassignment").post(assignmentService.AjouterAssignmnet);
// router.route("/inscription").post(utilisateurService.Inscription);


module.exports =router;


