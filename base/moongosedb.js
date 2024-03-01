let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.Moongodb_url, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });