//On importe les modules supplémentaires
const sauceModel = require('../models/sauce.js'); //On récupère le schéma (chemin réel)
const fs = require('fs');



// *****************  Logiques métier POST ***************** CREATE (C)

//Logique métier pour la création de sauce.
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new sauceModel({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée !' }))
    .catch(error => res.status(400).json({message: error.message }));
  };



// *****************  Logiques métier GET ***************** READ (R)

//Logique métier pour récupérer les sauces.
exports.sauces = (req, res, next) => {
    sauceModel.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ message: error.message }));
};

//Logique métier pour la voir une sauce.
exports.getOneSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ message: error.message }))
};



// *****************  Logiques métier MODIFY ***************** UPDATE (U)

//Logique métier pour modifier une sauce.
exports.modifyOneSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    sauceModel.updateOne({_id: req.params.id}, {...sauceObject , _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ message: error.message }));
};



// *****************  Logiques métier DELETE ***************** DELETE (D)

//Logique métier pour supprimer une sauce.
exports.deleteOneSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            sauceModel.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ message: error.message}));
        });
    })
    .catch(error => res.status(500).json({ message: error.message }));
};




//Logique métier pour like or dislike.
exports.sauceLike = (req, res, next) => {
const like = req.body.like;                 //Création constante du like.
const userId = req.body.userId;             //Création constante de l'Id utilisateur.
const sauceId = req.params.id;              //Création constante de l'Id de la sauce concernée.

    //On vérifie si l'utilisateur like ou dislike
    switch (like) {
        case 1:
            sauceModel.findOne({ _id: sauceId }) //On récupère l'id de la sauce concernée.
            .then((sauce) => {
                sauceModel.updateOne({ _id: sauceId }, {
                    $push: { usersLiked: userId }, //On ajoute l'userId dans le tableau créé dans le model.
                    $inc: { likes: 1 }, //On incrémente 1 au like.
                })

                .then(() => res.status(200).json({ message: 'Votre like a été pris en compte !' }))
                .catch((error) => res.status(400).json({ message: error.message }));
            })
            .catch((error) => res.status(400).json({ message: error.message }));
        break;

        case -1:
            sauceModel.findOne({ _id: sauceId })
            .then((sauce) => {
                sauceModel.updateOne({ _id: sauceId }, {
                    $push: { usersDisliked: userId }, 
                    $inc: { dislike: 1 },
                })

                .then(() => res.status(200).json({ message: 'Votre Dislike a été pris en compte !' }))
                .catch((error) => res.status(400).json({ message: error.message }));
            })
            .catch((error) => res.status(404).json({ message: error.message }));
        break;

        case 0:
            //Si l'utilisateur Reclique, il annule ce qu'il aime ou n'aime pas.
            sauceModel.findOne({ _id: sauceId })
            .then((sauce) => {
                //Si l'utilisateur à déjà like, on le retire, Sinon on retire du Dislike
                if (sauce.usersLiked.includes(userId)) {
                    sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: -1 }, //On retire le like
                        $pull: { usersLiked: userId }, //On retire l'utilisateur du tableau
                    })
                    .then(() => res.status(200).json({ message: 'Nous venons de retirer votre Like' }))
                    .catch((error) => res.status(400).json({ message: error.message }));
                } else {
                    sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { dislikes: -1 }, //On retire un dislike
                        $pull: { usersDisliked: req.body.iserId }, //On retire l'utilisateur du tableau Dislike
                    })
                    .then(() => res.status(200).json({ message: 'Votre Dislike a été retiré' }))
                    .catch((error) => res.status(400).json({ message: error.message }));
                }
            })
            .catch((error) => res.status(500).json({ message: error.message }));
    }
};