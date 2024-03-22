const matiere = require("../models/matiere")

const GetAllMatiere = async (req, res) => {
    try {
        matiere.find({}).then((data) => {
            return res.status(200).json({
                data
            });
        })
    } catch (error) {
        console.log('error', error);
    }

}

module.exports = {
    GetAllMatiere
}