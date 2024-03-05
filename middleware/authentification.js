const jwt = require("jsonwebtoken");


function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log('err', "Token invalide");
        return res.status(400).json({ message: 'Token invalide' });
      }
      req.utilisateur = decoded.id;
      req.utilisateur = decoded.email;
      req.utilisateur = decoded.role;
      next();
    });
  }

module.exports = {
 verifyToken
}