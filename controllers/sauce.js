const sauceModel = require('../models/sauce.js'); //On récupère le schéma (chemin réel)

//On récupère toutes les sauces dans MongoDB depuis le model.
//On export la fonction login pour l'utiliser après.
exports.sauce = (req, res, next) => {
    sauceModel.find()
    .then(sauces => {
        console.log(sauces);

        res.status(200).json(sauces)
    })
    .catch(error => res.status(500).json({ message: error.message }));
};