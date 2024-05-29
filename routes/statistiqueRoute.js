const express = require("express");

var router = express.Router();

const statController = require("../controller/statistiqueController");

router.route("/").get(statController.getStatEleve);


module.exports =router;


