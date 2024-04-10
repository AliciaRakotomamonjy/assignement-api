const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utilisateur = require("../models/utilisateur");
const SECRET_KEY = process.env.SECRET_KEY;
const {
    isEmail
} = require('validator');
const matiere = require("../models/matiere");
const {
    GetNameFichierAndUploadFichier
} = require("../util/fonction");
const assignmentEleve = require("../models/assignmentEleve");
const {
    SendMail
} = require("../util/Mail");
const assignment = require("../models/assignment");

const Login = async (req, res) => {
    const {
        email,
        motdepasse
    } = req.body;
    try {
        if (!isEmail(email)) {
            return res.status(400).json({
                message: "Adresse-Email invalide"
            })
        }
        const existUtilisateur = await utilisateur.findOne({
            email: email
        });
        if (!existUtilisateur) {
            return res.status(400).json({
                message: "Désolé, utilisateur introuvable. Veuillez réessayer."
            });
        }
        const verifMdp = await bcrypt.compare(motdepasse, existUtilisateur.motdepasse)
        if (!verifMdp) {
            return res.status(400).json({
                message: "Erreur de connexion. Veuillez vérifier votre adresse e-mail ou votre mot de passe."
            })
        }
        const m = await matiere.findOne({
            professeur: existUtilisateur._id
        })
        var token = null;
        if (m == null) {
            token = getTokenEtudiant(existUtilisateur);
        } else {
            token = getTokenProfesseur(existUtilisateur,m)
        }
        SendMail(email, "Connexion réussie sur Gestion d'Assignment", GetLoginSuccessEmail(existUtilisateur))
        console.log("token", token)
        res.status(200).json({
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Erreur dans votre code de connexion",
            error
        });
    }
}


function GetLoginSuccessEmail(utilisateur) {
    const message = `
    Bonjour ${utilisateur.nom} ${utilisateur.prenom},

Nous vous confirmons que vous venez de vous connecter à votre compte de Gestion d'Assignment.
    `;
    return message.trim();
}
function GetInscriptionSuccessEmail(utilisateur) {
    const message = `
    Bonjour ${utilisateur.nom} ${utilisateur.prenom},

    Nous vous souhaitons la bienvenue sur Gestion d'Assignment ! Votre inscription a été un succès.

    Connectez-vous dès maintenant à votre compte pour découvrir nos services.`;
    
    return message.trim();
}

function getTokenProfesseur(existUtilisateur,m) {
    return jwt.sign({
        email: existUtilisateur.email,
        id: existUtilisateur._id,
        nom: existUtilisateur.nom,
        prenom: existUtilisateur.prenom,
        photo: existUtilisateur.photo,
        role: existUtilisateur.role,
        matiere_id: m._id,
        matiere_libelle: m.libelle,
    }, SECRET_KEY, {
        expiresIn: process.env.EXPIRATION_TOKEN
    });
}

function getTokenEtudiant(utilisateur_) {
    return jwt.sign({
        email: utilisateur_.email,
        id: utilisateur_._id,
        nom: utilisateur_.nom,
        prenom: utilisateur_.prenom,
        photo: utilisateur_.photo,
        role: utilisateur_.role,
    }, SECRET_KEY, {
        expiresIn: process.env.EXPIRATION_TOKEN
    });
}
const Inscription = async (req, res) => {

    const {
        nom,
        prenom,
        email,
        motdepasse,
        validationmdp,
        role,
        libelle,
    } = req.body;
    console.log("body les " + req.body);
    const hasUppercase = /[A-Z]/.test(motdepasse);
    const hasLowercase = /[a-z]/.test(motdepasse);
    const hasNumber = /[0-9]/.test(motdepasse);
    const hasSpecialChar = /[!@#$%^&*()\-=_+{}[\]|\\:;"'<>,.?/~`]/.test(motdepasse);

    const hasMinimumLength = motdepasse.length >= 8;

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar || !hasMinimumLength) {
        return res.status(400).json({
            message: 'Le mot de passe doit contenir au moins 8 caractères, dont une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial'
        });
    }
    if (validationmdp != motdepasse) {
        return res.status(400).json({
            message: 'La validation du mot de passe est incorréte '
        });
    }
    try {
        const existUtilisateur = await utilisateur.findOne({
            email: email
        });
        if (!isEmail(email)) {
            return res.status(400).json({
                message: 'Adresse e-mail invalide'
            });
        }
        if (existUtilisateur) {
            return res.status(400).json({
                message: 'Adresse E-mail déjà utilisé'
            });
        }
        const hasshedPassord = await bcrypt.hash(motdepasse, 10);
        const utilisateur_ = await new utilisateur({
            nom: nom,
            prenom: prenom,
            email: email,
            motdepasse: hasshedPassord,
            role: role,
            photo:'male-student.png'
        }).save();
        var token = null;
        let nv_matier = null
        if (role == "prof") {
            let mat = {
                libelle: libelle,
                professeur: utilisateur_._id
            };
            nv_matier = await matiere(mat).save();
            token = getTokenProfesseur(utilisateur_,nv_matier)

        } else {
            token = getTokenEtudiant(utilisateur_)
        }
        SendMail(utilisateur_.email,"Inscription réussie sur Gestion d'Assignment",GetInscriptionSuccessEmail(utilisateur_))
        res.status(200).json({
            token: token,
            message: "inscription fini"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
}
const FaireDevoir = async (req, res) => {
    try {
        let fichierName = GetNameFichierAndUploadFichier(req, 'fichier');
        const AssignEleve = {
            description: req.body.description,
            eleve: req.utilisateur.id,
            assignment: req.body.assignmentId,
            fichier: fichierName,
            dateRendu: new Date()
        }
        const verifDejaFait = await assignmentEleve.findOne({
            eleve: AssignEleve.eleve,
            assignment: AssignEleve.assignment
        }).exec();
        if (verifDejaFait) {
            return res.status(400).json({
                message: "Attention ! Vous avez déjà soumis ce devoir. Veuillez vérifier vos soumissions précédentes."
            });
        }
        const assignmentEleveInstance = await assignmentEleve(AssignEleve).save();
        const assignment = await assignment.findOneAndUpdate(
            { _id: AssignEleve.assignment }, 
            { $push: { assignmenteleves: assignmentEleveInstance._id } }, 
            { new: true }
        ).exec();
        return res.status(201).json({
            message: "Félicitations ! Votre devoir est terminé avec succès !"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erreur dans votre code"
        });
    }
}
const ModifierProfile = async (req, res) => {
    try {
        let utilisateur_ = {
            nom: req.body.nom,
            prenom: req.body.prenom
        }
        if (req.files[0]) {
            utilisateur_.photo = GetNameFichierAndUploadFichier(req, 'image');
        }
        utilisateur.findByIdAndUpdate(req.utilisateur.id, utilisateur_, {
            new: true
        }).then(result => {
            if (result) {
                console.log(result)
                const token = getTokenEtudiant(result);
                res.status(201).json({
                    message: "Modification effectuée avec succès",
                    token: token,
                })
            } else {
                res.status(404).json({
                    message: " Inpossible de faire la modification."
                })
            }
        });
        return res.status(200);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erreur dans votre code"
        });
    }
}

module.exports = {
    Login,
    Inscription,
    FaireDevoir,
    ModifierProfile
}