const userModel = require('../models/user.js'); //On récupère le schéma (chemin réel)
const bcrypt = require('bcrypt'); //On récupère bcrypt
const jwt = require('jsonwebtoken'); //On récupère le module de token


//Début des logiques métiers ou fonctionnalités
//On export la fonction signup (inscription) pour l'utiliser après.
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    //Le .then récupère la réponse de la fonction hash. 
    .then((hash) => {
      const user = new userModel({
        email: req.body.email,
        password: hash
      })
      //On enregistre l'user dans la BDD
      user.save()
        //Réponse du serveur
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ message: error.message }));
};

//On export la fonction login pour l'utiliser après.
exports.login = (req, res, next) => {
    userModel.findOne({ email: req.body.email })
    .then(user => {
      console.log(user);
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => 
            res.status(500).json({ message: error.message })
          );
    })
    .catch(error => res.status(500).json({ message: error.message }));
};