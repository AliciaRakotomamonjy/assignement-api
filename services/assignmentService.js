const {
    ObjectId
} = require("mongodb");
const assignment = require("../models/assignment")
const matiere = require("../models/matiere")

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
module.exports = {
    GetAllAssignment,
    AjouterAssignmnet,
    EditeAssignment,
    GetAssignmentById,
    DeleteAssignment
}