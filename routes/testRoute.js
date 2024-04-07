const express = require("express");

var router = express.Router();

const service = require("../services/daoService");

router.route("/").get(service.testAPI);


module.exports = router;
