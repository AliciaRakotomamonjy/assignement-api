const express = require("express");

var router = express.Router();

const assignmentService = require("../services/assignmentService");

router.route("/getAllAssignment").post(assignmentService.GetAllAssignment);
// router.route("/inscription").post(utilisateurService.Inscription);


module.exports =router;


