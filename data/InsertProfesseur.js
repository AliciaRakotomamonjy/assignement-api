require("dotenv").config();
require("../base/moongosedb");

const utilisateur = require("../models/utilisateur");
const matiere = require("../models/matiere");

const professeur = [
    { nom: "Julien Moreau", prenom: "Julien", email: "ratsimhenintsoa@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-teacher.png", role: "prof" },
    { nom: "Émilie Dubois", prenom: "Émilie", email: "emilie.dubois@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-teacher.png", role: "prof" },
    { nom: "Lucas Bernard", prenom: "Lucas", email: "lucas.bernard@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-teacher.png", role: "prof" },
    { nom: "Chloe Petit", prenom: "Chloe", email: "chloe.petit@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-teacher.png", role: "prof" },
    { nom: "Maxime Roux", prenom: "Maxime", email: "maxime.roux@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-teacher.png", role: "prof" },
    { nom: "Sophie Martin", prenom: "Sophie", email: "sophie.martin@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-teacher.png", role: "prof" },
    { nom: "Guillaume Blanc", prenom: "Guillaume", email: "guillaume.blanc@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-teacher.png", role: "prof" },
    { nom: "Mélanie Leroy", prenom: "Mélanie", email: "melanie.leroy@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-teacher.png", role: "prof" },
    { nom: "Tristan Morin", prenom: "Tristan", email: "tristan.morin@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-teacher.png", role: "prof" }
];

const mat_ = [
    { libelle: "Algorithmique", profIndex: 0 },
    { libelle: "Sécurité Informatique", profIndex: 1 },
    { libelle: "Intelligence Artificielle", profIndex: 2 },
    { libelle: "Développement Web", profIndex: 3 },
    { libelle: "Big Data", profIndex: 4 },
    { libelle: "Blockchain", profIndex: 5 },
    { libelle: "Cybersécurité", profIndex: 6 },
    { libelle: "Cloud Computing", profIndex: 7 },
    { libelle: "Analyse de données", profIndex: 8 }
];

async function insertProfesseurAndMatiere() {
    for (let i = 0; i < professeur.length; i++) {
        const prof_ = professeur[i];
        const Utilisateur_ = await new utilisateur(prof_).save();
        const m = mat_.find(m => m.profIndex === i);
        const newMatiere = new matiere({
            libelle: m.libelle,
            professeur: Utilisateur_._id
        });
        
        await newMatiere.save();
    }

    console.log('Ajout des professeurs terminé.');
}

insertProfesseurAndMatiere();