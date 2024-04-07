const express = require("express");
const multer = require('multer');
const upload = multer({
    dest: 'fichier_assignment_eleve/'
});
var router = express.Router();

const assignmentService = require("../services/assignmentService");

router.route("/getAllAssignment").get(assignmentService.GetAllAssignment);
router.route("/ajouterassignment").post(assignmentService.AjouterAssignmnet);
router.route("/getassignmentbyid/:id").get(assignmentService.GetAssignmentById);
router.route("/editeassignment").put(assignmentService.EditeAssignment);
router.route("/deleteassignment/:id").delete(assignmentService.DeleteAssignment);
router.route("/getassignmentbyidwithdetails/:id").get(assignmentService.GetAssignmentByIdWithDetails);
router.route("/getassignmentbyidwithdetailsfiltered/:id").get(assignmentService.GetAssignmentByIdWithDetailsFiltered);
router.route("/ajouternoteassignmenteleve").put(assignmentService.AjouterNoteAssignmentEleve);
router.route("/getassignmentelevebyid/:id").get(assignmentService.GetAssignmentEleveById);
router.route("/eleve").get(assignmentService.getUserAssignement);
router.route("/devoir/:idAsignEleve").put(upload.any(), assignmentService.updateAssignementEleve);
// router.route("/inscription").post(utilisateurService.Inscription);


module.exports = router;


