const express = require("express");
const multer = require('multer');
const upload = multer({
    dest: 'fichier_assignment_eleve/'
});
var router = express.Router();
const assignmentEleveController = require("../controller/assignmentEleveController");

router.route("/").get(assignmentEleveController.GetAssignementEleve);
router.route("/:id").get(assignmentEleveController.GetAssignmentEleveById);
router.route("/:id").put(upload.any(),assignmentEleveController.UpdateAssignementEleve);
router.route("/:id/notes").put(assignmentEleveController.AjouterNoteAssignmentEleve);
router.route("/:id/fichier").get(assignmentEleveController.TelechargementFichierEleve);


module.exports = router;