const { ObjectId } = require("mongodb");
const assignmentEleve = require("../models/assignmentEleve");

const findById = async (assignmentEleveId) => {
    try {
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
        return result;
    } catch (error) {
        throw error;
    }
}

const findByIdSimple = async (assignmentEleveId) => {
    try {
        const result = await assignmentEleve.findById(assignmentEleveId);
        return result;
    } catch (error) {
        throw error;
    }
}


const update = async (id, data) => {
    try {
        let now = new Date();
        data.dateRendu = now
        const update = {
            $set: data
        };
        const options = { new: true };
        let updateObj = await assignmentEleve.findByIdAndUpdate(id, update, options);
        return updateObj;
    } catch (error) {
        throw error;
    }
}

const find = async (asignFiltre) => {
    try {
        let aggregateQuery = assignmentEleve.aggregate();

        asignFiltre = asignFiltre ? asignFiltre : {};
        let filters = {};

        if (asignFiltre.dateDebut !== undefined) {
            filters.dateRendu = {
                $gte: new Date(asignFiltre.dateDebut + 'T00:00:00.000Z')
            };
        }
        if (asignFiltre.dateFin !== undefined) {
            filters.dateRendu = {
                $lte: new Date(asignFiltre.dateFin + 'T23:59:59.999Z')
            };
        }
        if (asignFiltre.matiere && asignFiltre.matiere !== 'all') {
            filters["matiere._id"] = new ObjectId(asignFiltre.matiere);
        }
        if (asignFiltre.ideleve) {
            filters.eleve = new ObjectId(asignFiltre.ideleve);
        }

        aggregateQuery.sort({ 'dateRendu': -1 });

        aggregateQuery.lookup({
            from: 'assignments',
            localField: 'assignment',
            foreignField: '_id',
            as: 'assignment',
            pipeline: [
                {
                    $project: {
                        _id: 1,
                        assignmenteleves: 0
                    }
                }
            ]

        });

        aggregateQuery.unwind('$assignment');

        aggregateQuery.lookup({
            from: 'matieres',
            localField: 'assignment.matiere',
            foreignField: '_id',
            as: 'matiere'
        });

        aggregateQuery.unwind('$matiere');

        aggregateQuery.lookup({
            from: 'utilisateurs',
            localField: 'matiere.professeur',
            foreignField: '_id',
            as: 'professeur'
        });
        aggregateQuery.unwind('$professeur');
        let options = {
            page: parseInt(asignFiltre.page) || 1,
            limit: parseInt(asignFiltre.limit) || 10
        };



        console.log('filters', filters)

        if (Object.keys(filters).length > 0) {
            aggregateQuery.match(filters);
        }

        aggregateQuery.project({
            description: 1,
            assignment: {
                _id: 1,
                description: 1,
                matiere: {
                    _id: "$matiere._id",
                    libelle: "$matiere.libelle",
                    professeur: {
                        _id: "$professeur._id",
                        nom: "$professeur.nom",
                        prenom: "$professeur.prenom",
                    }
                },
                datePublication: 1,
                dateLimite: 1,
            },
            fichier: 1,
            rendu: 1,
            dateRendu: 1,
            note: 1,
            remarque: 1,
        })


        let data = await assignmentEleve.aggregatePaginate(aggregateQuery, options);
        return data;

    } catch (err) {
        throw err;
    }
}

const findByIdAndUpdate = async (id, data) => {
    try {
        const result = await assignmentEleve.findByIdAndUpdate(id, data, { new: true }).populate({
            path: 'eleve',
            model: 'utilisateurs',
            select: '_id nom prenom email',

        }).populate({
            path: 'assignment',
            select: '-assignmenteleves',
            populate: {
                path: 'matiere'
            }
        });
        return result;
    }catch(error){
        throw error;
    }       
    
}

module.exports = {
    findById,
    findByIdSimple,
    update,
    find,
    findByIdAndUpdate,
}