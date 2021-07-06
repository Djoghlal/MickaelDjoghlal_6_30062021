//On importe les modules supplémentaires
const sauceModel = require('../models/sauce.js'); //On récupère le schéma (chemin réel)

//Logique métier pour récupérer les sauces.
exports.sauce = (req, res, next) => {
    sauceModel.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ message: error.message }));
};

//Logique métier pour la création de sauce.
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée !' }))
    .catch(error => res.status(400).json({message: error.message }));
  };