const {
    ObjectId
} = require("mongodb");
const assignment = require("../models/assignment")
const assignmentEleve = require("../models/assignmentEleve")
const matiere = require("../models/matiere");
const { isNumber } = require("../util/fonction");

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
        return res.status(400).json({message:"Vous ne pouvez pas éditer cet assignment."})
    }
    assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}).then(result=>{
        if(result){
            res.status(201).json({message:"Modification effectuée avec succès"})
        }
        else{
            res.status(404).json({message:"Assignment introuvable."})
        }
    });

}

const DeleteAssignment= async(req, res) =>{
    console.log("id assignment" + req.params.id);

    assignment.deleteOne({_id: req.params.id}).then(result=>{
        if(result){
            res.status(201).json({message:"Suppression effectuée avec succès"})
        }
        else{
            res.status(404).json({message:"Assignment introuvable."})
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
        return res.status(200).json({
            message: "Votre devoir est bien ajouté"
        })
    })

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
        const assignmentToFind = await assignment.findById(assignmentId).populate("matiere").exec();
        if (!assignmentToFind) {
            return res.status(404).json({ message: 'Assignment introuvable.' });
        }

        const assignmentElevesRenduFalse = await assignmentEleve.find({ assignment: assignmentId, rendu: false }).populate('eleve', 'nom prenom _id').exec();
        const assignmentElevesRenduTrue = await assignmentEleve.find({ assignment: assignmentId, rendu: true }).populate('eleve', 'nom prenom _id').exec();

        return res.status(200).json({
            assignment: {
                _id: assignmentToFind._id,
                description: assignmentToFind.description,
                matiere: assignmentToFind.matiere,
                datePublication: assignmentToFind.datePublication,
                dateLimite: assignmentToFind.dateLimite
            },
            assignmentEleves: {
                rendu_false: assignmentElevesRenduFalse,
                rendu_true: assignmentElevesRenduTrue
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur lors de la récupération des données.' });
    }
}

const AjouterNoteAssignmentEleve = (req, res) => {
    let note = req.body.note
    if(!isNumber(note)){
        res.status(400).json({message:"Veuillez insérer un nombre pour la note"})
    }else{
        note = parseInt(note)
        if(note<0){
            res.status(400).json({message:"Veuillez insérer un nombre positif"})
        }
    }
    assignment.findByIdAndUpdate(req.body._id, {...req.body, rendu: true}, {new: true}).then(result=>{
        if(result){
            res.status(201).json({message:"Modification effectuée avec succès"})
        }else{
            res.status(404).json({message:"Assignment introuvable."})
        }
    });
}




module.exports = {
    GetAllAssignment,
    AjouterAssignmnet,
    EditeAssignment,
    GetAssignmentById,
    DeleteAssignment,
    GetAssignmentByIdWithDetails,
    GetAssignmentByIdWithDetailsFiltered,
    AjouterNoteAssignmentEleve
}