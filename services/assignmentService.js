const {
    ObjectId
} = require("mongodb");
const assignment = require("../models/assignment")
const assignmentEleve = require("../models/assignmentEleve")
const matiere = require("../models/matiere");
const { isNumber } = require("../util/fonction");
const services = require("./daoService");
const {
    GetNameFichierAndUploadFichier
} = require("../util/fonction");
const utilisateur = require("../models/utilisateur");
const { SendMail } = require("../util/Mail");


const GetAllAssignment = async (req, res) => {
    try {

        let aggregateQuery = assignment.aggregate();
        console.log("matiere : " + req.query.matiere)
        console.log("date debut : " + req.query.dateDebut)
        console.log("date Fin : " + req.query.dateFin)

        let filters = {};

        if (req.query.dateDebut !== undefined) {
            filters.datePublication = {
                ...filters.datePublication,
                $gte: new Date(req.query.dateDebut)
            };
        }
        if (req.query.dateFin !== undefined) {
            filters.datePublication = {
                ...filters.datePublication,
                $lte: new Date(req.query.dateFin)
            };
        }
        if (req.query.matiere != undefined && req.query.matiere !== 'all') {
            filters.matiere = new ObjectId(req.query.matiere);
        }

        console.log('filters', filters)

        if (Object.keys(filters).length > 0) {
            aggregateQuery.match(filters);
        }
        let options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        };
        let data = await assignment.aggregatePaginate(aggregateQuery, options);
        let populatedDocs = await assignment.populate(data.docs, {
            path: 'matiere',
            populate: {
                path: 'professeur',
                model: 'utilisateurs',
                select: 'nom prenom'
            }
        });
        data.docs = populatedDocs;
        return res.status(200).json(data);

    } catch (err) {
        console.log("Erreur " + err);
        return res.status(400).json({
            message: err
        });
    }
}


const EditeAssignment = async (req, res) => {
    console.log(req.utilisateur.matiereid);
    console.log(req.body.matiere);
    if (req.utilisateur.matiereid != req.body.matiere) {
        return res.status(400).json({ message: "Vous ne pouvez pas éditer cet assignment." })
    }
    assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }).then(result => {
        if (result) {
            res.status(201).json({ message: "Modification effectuée avec succès" })
        }
        else {
            res.status(404).json({ message: "Assignment introuvable." })
        }
    });

}

const DeleteAssignment = async (req, res) => {
    console.log("id assignment" + req.params.id);

    assignment.deleteOne({ _id: req.params.id }).then(result => {
        if (result) {
            res.status(201).json({ message: "Suppression effectuée avec succès" })
        }
        else {
            res.status(404).json({ message: "Assignment introuvable." })
        }
    });
}
const GetAssignmentById = async (req, res) => {
    let assignmentId = req.params.id;
    assignment.findOne({
        _id: assignmentId
    }).then(result => {
        if (result) {
            return res.status(200).json(result)
        } else {
            return res.status(400).json({
                message: "assignment introuvable."
            })
        }
    })

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
        utilisateur.find({role:'eleve'}).then((listEleve)=>{
            for (let index = 0; index < listEleve.length; index++) {
                const eleve = listEleve[index];
                SendMail(eleve.email,"Nouvel assignment de "+matiere.libelle+" ajouté",GetMessageMailAjoutAssignment(eleve,matiere.libelle,dateLimite,description))
            }
        })
        return res.status(200).json({
            message: "Votre devoir est bien ajouté"
        })
    })

}
function GetMessageMailAjoutAssignment(eleve,matiere,datelimite,description) {
    const message = `
    Bonjour ${eleve.nom} ${eleve.prenom},

    Je tenais à vous informer qu'un nouvel assignment a été ajouté pour la matière "${matiere}".

    Description de l'assignment : ${description}
    

    Date limite de soumission : ${datelimite}
    `;
    
    return message.trim(); // Supprimer les espaces indésirables
}
const GetAssignmentByIdWithDetails = (req, res) => {
    let assignmentId = req.params.id;
    assignment.findById(assignmentId)
        .populate({
            path: 'assignmenteleves',
            select: '-assignment',
            populate: {
                path: 'eleve',
                model: 'utilisateurs',
                select: '_id nom prenom email'
            }
        })
        .populate('matiere')
        .then(result => {
            if (result) {
                return res.status(200).json(result)
            } else {
                return res.status(400).json({
                    message: "assignment introuvable."
                })
            }
        })
}

const GetAssignmentByIdWithDetailsFiltered = async (req, res) => {
    let assignmentId = req.params.id;

    try {

        const assignmentElevesRenduFalse = await assignmentEleve.find({ assignment: assignmentId, rendu: false })
            .populate({
                path: 'eleve',
                model: 'utilisateurs',
                select: '_id nom prenom email',

            }).populate({
                path: 'assignment',
                select: '-assignmenteleves',
                populate: {
                    path: 'matiere'
                }
            }).exec();

        const assignmentElevesRenduTrue = await assignmentEleve.find({ assignment: assignmentId, rendu: true })
            .populate({
                path: 'eleve',
                model: 'utilisateurs',
                select: '_id nom prenom email',

            }).populate({
                path: 'assignment',
                select: '-assignmenteleves',
                populate: {
                    path: 'matiere'
                }
            }).exec();

        return res.status(200).json({
            rendu_false: assignmentElevesRenduFalse,
            rendu_true: assignmentElevesRenduTrue
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur lors de la récupération des données.' });
    }
}

const AjouterNoteAssignmentEleve = (req, res) => {
    let note = req.body.note
    if (!isNumber(note)) {
        return res.status(400).json({ message: "Veuillez insérer un nombre pour la note" })
    } else {
        note = parseInt(note)
        if (note < 0) {
            return res.status(400).json({ message: "Veuillez insérer un nombre positif" })
        }
    }
    assignmentEleve.findByIdAndUpdate(req.body._id, { ...req.body, rendu: true }, { new: true }).populate({
        path: 'eleve',
        model: 'utilisateurs',
        select: '_id nom prenom email',

    }).populate({
        path: 'assignment',
        select: '-assignmenteleves',
        populate: {
            path: 'matiere'
        }
    }).then(result => {
        if (result) {
            return res.status(201).json({ message: "Modification effectuée avec succès", result })
        } else {
            return res.status(404).json({ message: "Assignment introuvable." })
        }
    });
}

const GetAssignmentEleveById = async (req, res) => {
    let assignmentEleveId = req.params.id;
    console.log(assignmentEleveId)
    const result = await assignmentEleve.findById(assignmentEleveId).populate({
        path: 'eleve',
        model: 'utilisateurs',
        select: '_id nom prenom email',

    }).populate({
        path: 'assignment',
        select: '-assignmenteleves',
        populate: {
            path: 'matiere',
            populate: {
                path: 'professeur'
            }
        }
    })

    if (result) {
        return res.status(200).json(result)
    } else {
        return res.status(400).json({
            message: "assignment eleve introuvable."
        })
    }


}


const getUserAssignement = async (req, res) => {
    try {
        let { dateDebut, dateFin, idMatiere, page, limit } = req.query;
        let iduser = req.utilisateur;
        let filtre = {
            dateDebut,
            dateFin,
            matiere: idMatiere,
            ideleve: iduser,
            page,
            limit
        }
        let result = await services.getAllAssignmentUser(filtre);
        return res.status(200).json(result);
    } catch (error) {
        console.log("🚀 ~ testAPI ~ error:", error)
        return res.status(500).json(error);
    }
}

const updateAssignementEleve = async (req, res) => {
    try {
        let id = req.params.idAsignEleve;
        let { description } = req.body;
        var fichierName = GetNameFichierAndUploadFichier(req, 'fichier');

        let value = {};
        description ? value.description = description : null;
        fichierName ? value.fichier = fichierName : null;

        if (value.description || value.fichier) {
            let updateObj = await services.updateAssignementEleve(id, value);
        } else {
            return res.status(400).json({
                message: 'BAD REQUEST',
                details: "Aucune  valeur  n' est  passé  en body "
            })
        }
        return res.status(200).json({
            message: 'SUCCESS',
            details: "update  effectué "
        })

    } catch (error) {
        console.log("🚀 ~ testAPI ~ error:", error)
        return res.status(500).json(error);
    }
}



module.exports = {
    GetAllAssignment,
    AjouterAssignmnet,
    EditeAssignment,
    GetAssignmentById,
    DeleteAssignment,
    GetAssignmentByIdWithDetails,
    GetAssignmentByIdWithDetailsFiltered,
    AjouterNoteAssignmentEleve,
    GetAssignmentEleveById,
    getUserAssignement,
    updateAssignementEleve
}