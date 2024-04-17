require("dotenv").config();
require("../base/moongosedb");

const matiere = require("../models/matiere");
const assignment = require("../models/assignment");

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function setupDateRanges() {
    const startPublication = new Date('2024-01-01T00:00:00Z');
    const endPublication = new Date();
    const startLimite = new Date('2024-04-19T00:00:00Z');
    const endLimite = new Date('2024-06-30T23:59:59Z');

    return { startPublication, endPublication, startLimite, endLimite };
}

function getRandomDescription(matiereLibelle) {
    const tasks = ['Analyse de', 'Étude de cas sur', 'Projet de fin de module sur', 'Rapport détaillé sur', 'Exercices pratiques de'];
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    return `${task} ${matiereLibelle}`;
}
async function insertAssignments() {
    try {
        const matieres = await matiere.find();

        for (let i = 0; i < 1000; i++) {
        let { startPublication, endPublication, startLimite, endLimite } = setupDateRanges();
            const matiereRandom = matieres[Math.floor(Math.random() * matieres.length)];
            const datePublication = getRandomDate(startPublication, endPublication);
            const dateLimite = getRandomDate(startLimite, endLimite);

            const Assign_ = new assignment({
                description: getRandomDescription(matiereRandom.libelle),
                matiere: matiereRandom._id,
                datePublication: datePublication,
                dateLimite: dateLimite,
            });
            console.log('Assign_'+i, Assign_)
            await assignment(Assign_).save();
        }
        console.log("l'insertion de 1000 assignment est fini");
    } catch (err) {
        console.error('Failed to insert assignments:', err);
    }
}


insertAssignments();