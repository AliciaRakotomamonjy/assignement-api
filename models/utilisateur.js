let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const RoleEnum = Object.freeze({
    ELEVE: 'eleve',
    PROF: 'prof'
});
let UtilisateurSchema = Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    motdepasse: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    role: { type: String, enum: Object.values(RoleEnum), required: true }
    /* 
    1 = prof
    2 = eleve
    */
});

UtilisateurSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('utilisateurs', UtilisateurSchema);
