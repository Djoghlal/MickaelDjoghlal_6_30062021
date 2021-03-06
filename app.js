//On importe les modules supplémentaires
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config(); //On ne créer pas de const car on ne l'utilise pas ailleurs on ne l'appelle qu'ici.

const usersRoutes = require('./routes/user.js');
const sauceRoutes = require('./routes/sauce.js');

const app = express();

//Connexion à la BDD MongoDB
//Process sert à importer la ligne de connexion MONGO_LINK du fichier .env
mongoose.connect(process.env.MONGO_LINK,
{ 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})

  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//App use du Helmet
app.use(helmet());

//Mise en place des headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //Indication de la source du frontend autorisée.
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //On permet l'autorisation des GET, POST etc...
  next();
});

//Utilisation de bodyParser json
app.use(bodyParser.json());

//On utilise les routes pour faire la passerelle vers le frontEnd avec le backend
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', usersRoutes);
app.use('/api/sauces', sauceRoutes);

//Message de confirmation de requête reçue.
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 });

module.exports = app;