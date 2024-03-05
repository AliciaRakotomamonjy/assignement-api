let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentSchema = Schema({
    description: {
        type: String,
        required: true
    },
    matiere: { type: mongoose.Schema.Types.ObjectId, ref: 'matieres' },
    datePublication: {
        type: Date,
        default: Date.now
    },
    dateLimite: {
        type: Date,
        required: true
    },
});

AssignmentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('assignments', AssignmentSchema);
