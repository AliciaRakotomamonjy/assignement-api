const assignment = require("../models/assignment")
const matiere = require("../models/matiere")

const GetAllAssignment = async (req, res) => {

    console.log("liste assignemnt ++++++++++")
}

const AjouterAssignmnet = async (req, res) => {
    const {
        dateLimite,
        description
    } = req.body

    if (dateLimite == null || description == "" || dateLimite === undefined) {
        console.log("Veuillez remplir les champs svp !!")
        return res.status(400).json({
            message: "Veuillez remplir les champs svp !!"
        })
    }
    const dateDuJour = new Date();
    const dateLimiteObj = new Date(dateLimite);
    if (dateLimiteObj <= dateDuJour) {
        console.log("La date limite doit être supperieur à la date du jour")
        return res.status(400).json({
            message: "La date limite doit être supperieur à la date du jour"
        })
    }
    matiere.findOne({
        professeur: req.utilisateur.id
    }).then((matiere) => {
        console.log(matiere)

         new assignment({
            description: description,
            matiere: matiere._id,
            dateLimite: dateLimite
        }).save()
        return res.status(200).json({
            message: "Votre devoir est bien ajouté"
        })
    })

}
module.exports = {
    GetAllAssignment,
    AjouterAssignmnet
}