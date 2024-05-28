const fs = require('fs');
const path = require('path');
const DIR_UPLOAD_FICHIER = '/../fichier_assignment_eleve';
const DIR_UPLOAD_IMAGE = '/../img';

function GetNameFichierAndUploadFichier(req, contenu) {
    if (req.files && req.files.length > 0) {
        var file = req.files[0];
        if (!file) {
            console.log('Fichier introuvable!');
            return;
        }
        const nomPhoto = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        var newPath = null
        if (contenu == 'image') {
            newPath = path.join(__dirname, DIR_UPLOAD_IMAGE, nomPhoto);
        }
        if (contenu == 'fichier') {
            newPath = path.join(__dirname, DIR_UPLOAD_FICHIER, nomPhoto);
        }
        fs.rename(file.path, newPath, err => {
            if (err) {
                console.log('Erreur upload Fichier');
                console.error(err);
            } else {
                console.log('Fichier uploadé avec succès !');
            }
        });
        return nomPhoto;
    }
    return null;
}

function UpdateFichier(req, contenu,oldPath) {
    if (req.files && req.files.length > 0) {
        var file = req.files[0];
        if (!file) {
            console.log('Fichier introuvable!');
            return;
        }
        const nomPhoto = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        var newPath = null
        if (contenu == 'image') {
            newPath = path.join(__dirname, DIR_UPLOAD_IMAGE, nomPhoto);
            oldPath = path.join(__dirname, DIR_UPLOAD_IMAGE, oldPath);
        }
        if (contenu == 'fichier') {
            newPath = path.join(__dirname, DIR_UPLOAD_FICHIER, nomPhoto);
            oldPath = path.join(__dirname, DIR_UPLOAD_FICHIER, oldPath);
        }
        
        // Vérifier si un fichier existe déjà à l'emplacement de destination
        if (fs.existsSync(oldPath)) {
            // Supprimer le fichier existant
            fs.unlinkSync(oldPath);
            console.log('Fichier existant supprimé avec succès !');
        }
        fs.rename(file.path, newPath, err => {
            if (err) {
                console.log('Erreur upload Fichier');
                console.error(err);
            } else {
                console.log('Fichier uploadé avec succès !');
            }
        });
        return nomPhoto;
    }
    return null;
}

const isNumber = (str) => {
    return /^-?\d*\.?\d+$/.test(str);
}

const getPathFileEleve = (nomFichier) => {
    const appDir = path.dirname(require.main.path)
    const dossier = path.join(appDir, 'fichier_assignment_eleve');
    const cheminFichier = path.join(dossier, nomFichier); 
    return cheminFichier
}

const fichierExiste = (cheminVersFichier) => {
    return fs.existsSync(cheminVersFichier);
}


module.exports = {
    GetNameFichierAndUploadFichier,
    isNumber,
    getPathFileEleve,
    fichierExiste,
    UpdateFichier
}