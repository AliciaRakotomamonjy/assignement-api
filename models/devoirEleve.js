let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let DevoirEleveSchema = Schema({
    description: {
        type: String,
        required: true
    },
    eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'utilisateurs' },
    devoir: { type: mongoose.Schema.Types.ObjectId, ref: 'devoirs' },
    fichier: {type: String},
    rendu: {type: Boolean, default: false},
    dateRendu: { type: Date },
    note: { type: Number },
    remarque: {type: String},
});

DevoirEleveSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('devoireleves', DevoirEleveSchema);
