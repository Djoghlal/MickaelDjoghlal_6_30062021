const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/user.js');
const bodyParser = require('body-parser');
const app = express();



//Connexion à la BDD MongoDB
mongoose.connect('mongodb+srv://MickaP6:878a74BPLzYSr5xM@djoghlalp6.9gp8s.mongodb.net/Projet6?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })

  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //Indication de la source du frontend autorisée.
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Un truc inutile !
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //On permet l'autorisation des GET, POST etc...
  next();
});

//Il faut l'installer !!
app.use(bodyParser.json());

//On utilise les routes pour faire la passerelle vers le frontEnd avec le backend
app.use('/api/auth', usersRoutes);
//app.use('/api/auth', userRoutes);


app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 });


 

module.exports = app;