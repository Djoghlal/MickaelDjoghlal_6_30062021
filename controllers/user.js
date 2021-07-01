//J'intègre le chemin réel du schéma user.
//Intégration de bcrypt
//Intégration du module Tocken
const userModel = require('../models/user.js');
const bcrypt = require('bcrypt');

//Début des logiques métiers ou fonctionnalités
//On export la fonction signup (inscription) pour l'utiliser après ailleurs
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    //Le .then récupère la réponse de la fonction hash. 
    .then((hash) => {
      const user = new userModel({
        email: req.body.email,
        password: hash
      });
      //On enregistre l'user dans la BDD
      user.save()
        //Réponse du serveur
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ message: error.message }));
};