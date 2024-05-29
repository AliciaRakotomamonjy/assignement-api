const statistiqueService = require("../services/statistiqueService")
const getStatEleve = async (req, res) => {
    let eleve = req.utilisateur;
    const { dateDebut, dateFin } = req.query;
    const filter = {dateDebut, dateFin, eleve: eleve.id };
    try {
        const statistics = await statistiqueService.getStatEleve(filter);
        res.status(200).json(statistics);
    } catch (error) {
        res.status(500).send('Error fetching statistics');
    }

}

module.exports = {
    getStatEleve,
}