const jwt = require("jsonwebtoken");


function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          message: 'Token invalide'
        });
      }
      req.utilisateur = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        matiereid: decoded.matiere_id
      };
      next();
    });
  } catch {
    return res.status(400).json({
      message: 'Pas de Token'
    });
  }

}

module.exports = {
  verifyToken
}