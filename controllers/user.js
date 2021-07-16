const userModel = require('../models/user.js'); //On récupère le schéma (chemin réel)
const bcrypt = require('bcrypt'); //On récupère bcrypt
const jwt = require('jsonwebtoken'); //On récupère le module de token

const passwordValidator = require('password-validator');

//Création du schéma du mot de passe
const schemaPassword = new passwordValidator();

//On détermine la sécurité du mot de passe (schéma)
schemaPassword
.is().min(8)                                    // Minimum 8 caractères
.is().max(15)                                   // Maximum 15 caractères
.has().uppercase(1)                             // Au moins 1 majuscule
.has().lowercase(1)                             // Au moins 1 minuscule
.has().digits(1)                                // Au moins 1 chiffre
.has().not().spaces()                           // Espaces ne sont pas autorisés
.is().not().oneOf(['Passw0rd', 'Password123']); // Interdiction d'écrire ces deux mots de passe



// *****************  Logiques métier POST ***************** CREATE (C)

//Début des logiques métiers ou fonctionnalités
//On export la fonction signup (inscription) pour l'utiliser après.
exports.signup = (req, res, next) => {
  //Si le password est différent du schemaPassword sinon c'est ok.
  if (!schemaPassword.validate(req.body.password)) {
    return res.status(400).json({ message: 'Le mot de passe n\est pas valide !' });
  } else {
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
        .catch(error => res.status(400).json({ message: error.message }));
    })
    .catch(error => res.status(500).json({ message: error.message }));
  }
};

//On export la fonction login pour l'utiliser après.
exports.login = (req, res, next) => {
    userModel.findOne({ email: req.body.email })
    .then(user => {
      //console.log(user);
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