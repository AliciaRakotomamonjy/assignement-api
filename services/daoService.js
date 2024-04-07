const assignment = require("../models/assignment")
const assignmentEleve = require("../models/assignmentEleve")
// const { ObjectId } = require("mongodb");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;



const testAPI = async (req, res) => {
    try {
        let result = await getAllAssignmentUser(null);
        return res.status(200).json(result);
    } catch (error) {
        console.log("🚀 ~ testAPI ~ error:", error)
        return res.status(500).json(error);
    }
}


const getAllAssignmentUser = async (asignFiltre) => {
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
        let options = {
            page: parseInt(asignFiltre.page) || 1,
            limit: parseInt(asignFiltre.limit) || 10
        };



        console.log('filters', filters)

        if (Object.keys(filters).length > 0) {
            aggregateQuery.match(filters);
        }


        let data = await assignmentEleve.aggregatePaginate(aggregateQuery, options);
        return data;

    } catch (err) {
        throw err;
    }
}


const updateAssignementEleve = async (id, data) => {
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


module.exports = {
    testAPI,
    getAllAssignmentUser,
    updateAssignementEleve
}
