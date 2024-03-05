const fs = require('fs');
const path = require('path');

function GetNamePhotoAndUploadPhoto(req, res) {
    var file = req.files[0];
    if (!file) {
        console.log('Fichier introuvable!');
        return;
    }
    const nomPhoto = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const newPath = path.join(__dirname, '/../uploads', nomPhoto);
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
    GetNamePhotoAndUploadPhoto,
}