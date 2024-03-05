let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentEleveSchema = Schema({
    description: {
        type: String,
        required: true
    },
    eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'utilisateurs' },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'assignments' },
    fichier: {type: String},
    rendu: {type: Boolean, default: false},
    dateRendu: { type: Date },
    note: { type: Number },
    remarque: {type: String},
});

AssignmentEleveSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('assignmenteleves', AssignmentEleveSchema);
