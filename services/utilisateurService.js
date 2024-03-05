
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utilisateur = require("../models/utilisateur");
const SECRET_KEY = process.env.SECRET_KEY;

const Login = async (req, res) => {

    const {
      email,
      motdepasse
    } = req.body;
    try {
      const existUtilisateur = await utilisateur.findOne({
        email: email
      });
      if (!existUtilisateur) {
        return res.status(400).json({
          message: "Désolé, utilisateur introuvable. Veuillez réessayer."
        });
      }
      const verifMdp = await bcrypt.compare(motdepasse, existUtilisateur.motdepasse)
      if (!verifMdp) {
        return res.status(400).json({
          message: "Erreur de connexion. Veuillez vérifier votre adresse e-mail ou votre mot de passe."
        })
      }
      const token = jwt.sign({
        email: existUtilisateur.email,
        id: existUtilisateur._id,
        role:existUtilisateur.role,
      }, SECRET_KEY, {
        expiresIn: process.env.EXPIRATION_TOKEN
      });
      res.status(200).json({
        nom: existUtilisateur.nom,
        prenom: existUtilisateur.prenom,
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Erreur dans votre code de connexion",
        error
      });
    }
  }

module.exports = {
    Login
}