const assignmentEleveService = require("../services/assignmentEleveService");
const { isNumber, getPathFileEleve, fichierExiste } = require("../util/fonction");

const GetAssignmentEleveById = async (req, res) => {
    let assignmentEleveId = req.params.id;
    console.log(assignmentEleveId)
    const result = await assignmentEleveService.findById(assignmentEleveId);
    if (result) {
        return res.status(200).json(result)
    } else {
        return res.status(400).json({
            message: "assignment eleve introuvable."
        })
    }

}

const UpdateAssignementEleve = async (req, res) => {
    try {
        let id = req.params.id;
        let { description } = req.body;
        var fichierName = GetNameFichierAndUploadFichier(req, 'fichier');

        let value = {};
        description ? value.description = description : null;
        fichierName ? value.fichier = fichierName : null;
        let updateObj;
        if (value.description || value.fichier) {
            updateObj = await assignmentEleveService.update(id, value);
        } else {
            return res.status(400).json({
                message: 'BAD REQUEST',
                details: "Aucune  valeur  n' est  passé  en body "
            });
        }
        return res.status(200).json({
            message: 'SUCCESS',
            details: "update  effectué ",
            result: updateObj
        });

    } catch (error) {
        console.log("🚀 ~ UpdateAssignementEleve ~ error:", error)
        return res.status(500).json(error);
    }
}

const GetAssignementEleve = async (req, res) => {
    try {
        let { dateDebut, dateFin, idMatiere, page, limit } = req.query;
        let iduser = req.utilisateur;
        let filtre = {
            dateDebut,
            dateFin,
            matiere: idMatiere,
            ideleve: iduser,
            page,
            limit
        }
        let result = await assignmentEleveService.find(filtre);
        return res.status(200).json(result);
    } catch (error) {
        console.log("🚀 ~ GetAssignementEleve ~ error:", error)
        return res.status(500).json(error);
    }
}

const AjouterNoteAssignmentEleve = async (req, res) => {
    let note = req.body.note
    if (!isNumber(note)) {
        return res.status(400).json({ message: "Veuillez insérer un nombre pour la note" })
    } else {
        note = parseInt(note)
        if (note < 0) {
            return res.status(400).json({ message: "Veuillez insérer un nombre positif" })
        }
    }
    const result = await assignmentEleveService.findByIdAndUpdate(req.params.id, { ...req.body, rendu: true });
    if (result) {
        return res.status(201).json({ message: "Modification effectuée avec succès", result })
    } else {
        return res.status(404).json({ message: "Assignment introuvable." })
    }
    
}

const TelechargementFichierEleve = async (req, res) => {
    try {
        let assignmentEleveId = req.params.id;
        console.log(assignmentEleveId)
        const assignmentEleve = await assignmentEleveService.findByIdSimple(assignmentEleveId);
        let nomFichier = assignmentEleve?.fichier;
        let cheminVersFichier = getPathFileEleve(nomFichier);
        console.log("cheminVersFichier "+cheminVersFichier)
        let existe = fichierExiste(cheminVersFichier);
        if(existe){
            res.download(cheminVersFichier, nomFichier, (err) => {
                if (err) {
                    console.error('Erreur lors du téléchargement du fichier :', err);
                    res.status(500).send('Erreur lors du téléchargement du fichier.');
                }
            });
        }else{
            return res.status(400).send("Le fichier n'existe pas");
        }

        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}

module.exports = {
    GetAssignmentEleveById,
    UpdateAssignementEleve,
    GetAssignementEleve,
    AjouterNoteAssignmentEleve,
    TelechargementFichierEleve
}