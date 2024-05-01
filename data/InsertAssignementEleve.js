require("dotenv").config({
    path: '../.env'
});
require("../base/moongosedb");

const utilisateur = require("../models/utilisateur");
const assignmentEleve = require("../models/assignmentEleve");
const assignment = require("../models/assignment");
const matiere = require("../models/matiere");


function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRendu() {
    return Math.random() < 0.5;
}

function generateRandomNote() {
    return Math.floor(Math.random() * 21);
}

function generateRemarque(note) {
    if (note >= 0 && note < 5) {
        return "Très insatisfaisant, des améliorations sont nécessaires.";
    } else if (note >= 5 && note < 10) {
        return "Peut mieux faire, nécessite plus d'efforts.";
    } else if (note >= 10 && note < 12) {
        return "Moyen, mais améliorable.";
    } else if (note >= 12 && note < 15) {
        return "Bien, mais peut être amélioré.";
    } else if (note >= 15 && note < 18) {
        return "Très bien, bon travail!";
    } else {
        return "Excellent, félicitations!";
    }
}


function generateRandomDescription(matiereLibelle) {
    const tasks = [
        'Voici mon devoir de',
        'Analyse approfondie de',
        'Étude pratique sur',
        'Projet innovant concernant',
        'Rapport avancé sur',
        'Examen sur',
        'Synthèse sur',
        'Développement de',
        'Exploration de',
        'Conception de'
    ];
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    return `${task} ${matiereLibelle}`;
}

async function insertAssignmentsEleve() {
    const assignments = await assignment.find({
        datePublication: {
            $lt: new Date('2024-04-01')
        }
    }).populate('matiere');
    const eleves = await utilisateur.find({
        role: 'eleve'
    });
    let count_assignment = 0;
    for (const assignment of assignments) {
        count_assignment++;
        let count_eleve = 0;
        for (const eleve of eleves) {
            count_eleve++;
            const _rendu = generateRendu();
            let _note = null;
            let _remarque = null;
            let _dateRenvoiDevoir = getRandomDate(assignment.datePublication, assignment.dateLimite);
            if (_rendu) {
                _note = generateRandomNote();
                _remarque = generateRemarque(_note);
            }
            const _nAssignmentEleve = new assignmentEleve({
                description: generateRandomDescription(assignment.matiere.libelle),
                eleve: eleve._id,
                assignment: assignment._id,
                fichier: "MonDevoir.pdf",
                rendu: _rendu,
                dateRendu: _dateRenvoiDevoir,
                note: _rendu ? _note : null,
                remarque: _rendu ? _remarque : null
            });
            await _nAssignmentEleve.save();

            assignment.assignmenteleves.push(_nAssignmentEleve._id);
            console.log("insertion pour " + eleve.nom);
            console.log("ElveAssignment_" + count_eleve + _nAssignmentEleve)
        }
        await assignment.save();
        console.log("Assginement_" + count_assignment + assignment)

    }

    console.log('Ajout des AssignementEleve terminées.');
}

insertAssignmentsEleve();