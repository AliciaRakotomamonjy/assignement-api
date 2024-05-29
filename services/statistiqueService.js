const { ObjectId } = require("mongodb");
const assignmentEleve = require("../models/assignmentEleve");

const getStatEleve = async (assignFilter) => {
    try {
        let filtre = {}

        if (assignFilter.eleve) {
            filtre.eleve = new ObjectId(assignFilter.eleve);
        }

        if (assignFilter.dateDebut !== undefined) {
            filtre.dateRendu = {
                ...filtre.dateRendu,
                $gte: new Date(assignFilter.dateDebut + 'T00:00:00.000Z')
            };
        }
        if (assignFilter.dateFin !== undefined) {
            filtre.dateRendu = {
                ...filtre.dateRendu,
                $lte: new Date(assignFilter.dateFin + 'T23:59:59.999Z')
            };
        }


        let statistics = await assignmentEleve.aggregate([
            {
                $match: {
                    ...filtre,
                    rendu: true
                }
            },
            {
                $lookup: {
                    from: 'assignments',
                    localField: 'assignment',
                    foreignField: '_id',
                    as: 'assignmentDetails'
                }
            },
            {
                $unwind: '$assignmentDetails'
            },
            {
                $lookup: {
                    from: 'matieres',
                    localField: 'assignmentDetails.matiere',
                    foreignField: '_id',
                    as: 'matiereDetails'
                }
            },
            {
                $unwind: '$matiereDetails'
            },
            {
                $group: {
                    _id: '$matiereDetails.libelle',
                    averageNote: { $avg: '$note' }
                }
            },
            {
                $project: {
                    _id: 0,
                    matiere: '$_id',
                    averageNote: 1
                }
            }
        ]);
        statistics = statistics.map(stat => ({
            matiere: stat.matiere,
            averageNote: parseFloat(stat.averageNote.toFixed(2))
        }));
        return statistics;
    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = {
    getStatEleve,
}