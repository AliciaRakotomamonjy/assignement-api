let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let MatiereSchema = Schema({
    libelle: {
        type: String,
        required: true
    },
    professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'utilisateurs' }
});

MatiereSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('matieres', MatiereSchema);
