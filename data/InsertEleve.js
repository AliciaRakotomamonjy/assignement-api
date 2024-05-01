require("dotenv").config({path: '../.env' });
require("../base/moongosedb");

const utilisateur = require("../models/utilisateur");

const Eleves = [
    { nom: "Julien Moreau", prenom: "Julien", email: "ratsimhenintsoa@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-student.png", role: "eleve" },
    { nom: "Julien Moreau", prenom: "Julien", email: "ratsimhenintsoa@gmail.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-student.png", role: "eleve" },
    { nom: "Sophie Dupont", prenom: "Sophie", email: "sophie.dupont@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-student.png", role: "eleve" },
    { nom: "Thomas Martin", prenom: "Thomas", email: "thomas.martin@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-student.png", role: "eleve" },
    { nom: "Emma Robert", prenom: "Emma", email: "emma.robert@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-student.png", role: "eleve" },
    { nom: "Lucas Martin", prenom: "Lucas", email: "lucas.martin@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-student.png", role: "eleve" },
    { nom: "Léa Garcia", prenom: "Léa", email: "lea.garcia@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-student.png", role: "eleve" },
    { nom: "Hugo Leroy", prenom: "Hugo", email: "hugo.leroy@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-student.png", role: "eleve" },
    { nom: "Camille Laurent", prenom: "Camille", email: "camille.laurent@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-student.png", role: "eleve" },
    { nom: "Mathis Dubois", prenom: "Mathis", email: "mathis.dubois@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-student.png", role: "eleve" },
    { nom: "Inès Simon", prenom: "Inès", email: "ines.simon@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-student.png", role: "eleve" },
    { nom: "Nathan Petit", prenom: "Nathan", email: "nathan.petit@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-student.png", role: "eleve" },
    { nom: "Alice Roussel", prenom: "Alice", email: "alice.roussel@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-student.png", role: "eleve" },
    { nom: "Louis Martinez", prenom: "Louis", email: "louis.martinez@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-student.png", role: "eleve" },
    { nom: "Chloé Lefevre", prenom: "Chloé", email: "chloe.lefevre@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-student.png", role: "eleve" },
    { nom: "Ethan Robin", prenom: "Ethan", email: "ethan.robin@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "male-student.png", role: "eleve" },
    { nom: "Zoé Durand", prenom: "Zoé", email: "zoe.durand@example.com", motdepasse: "$2b$10$0MExCOBZFPkEVqBgvyUGVOxWi7fGyOWBjERK8zwX109DbTyuRQOKi", photo: "female-student.png", role: "eleve" },
];


async function insertionDesEleves() {
   await utilisateur.insertMany(Eleves)
   .then(function (docs) {
     console.log('Insertion réussie :', docs.length, 'élèves ajoutés.');
   })
   .catch(function (err) {
     console.error('Erreur lors de l\'insertion des élèves :', err);
   });

    console.log('Ajout des Eleves terminé.');
}

insertionDesEleves();