const fs = require('fs');
const path = require('path');
const DIR_UPLOAD_FICHIER='/../fichier_assignment_eleve';
const DIR_UPLOAD_IMAGE='/../img';

function GetNameFichierAndUploadFichier(req,contenu) {
    var file = req.files[0];
    if (!file) {
        console.log('Fichier introuvable!');
        return;
    }
    const nomPhoto = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    var newPath = null 
    if (contenu=='image') {
        newPath= path.join(__dirname, DIR_UPLOAD_IMAGE, nomPhoto);
    }
    if (contenu=='fichier') {
        newPath= path.join(__dirname, DIR_UPLOAD_FICHIER, nomPhoto);
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

module.exports = {
    GetNameFichierAndUploadFichier,
}