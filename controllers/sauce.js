//On importe les modules supplémentaires
const sauceModel = require('../models/sauce.js'); //On récupère le schéma (chemin réel)
const fs = require('fs');

//Logique métier pour récupérer les sauces.
exports.sauces = (req, res, next) => {
    sauceModel.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ message: error.message }));
};

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

//Logique métier pour la voir une sauce.
exports.getOneSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ message: error.message }))
};

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
    sauceModel.findOne({ _id: req.params.id })
        .then(sauce => {
            const like = req.body.like;                 //Création constante du like.
            const userId = req.body.userId;             //Création constante de l'Id utilisateur.
            const usersLiked = sauce.usersLiked;        //Création constante des utilisateurs qui like.
            const usersDisliked = sauce.userDisliked;   //Création constante des utilisateurs qui dislike.
            const sauceId = req.params.id;              //Création constante de l'Id de la sauce concernée.

            //On vérifie si l'utilisateur like
            switch (like) {
                case 1:
                    //Si l'utilisateur Like et qu'il a déjà cliqué dessus une fois, Sinon on fait le nécessaire pour ajouter le like.
                    if (usersLiked.includes(userId)) {
                        res.status(403).json({ error: 'Vous ne pouvez pas liker deux fois la même sauce !!'}) //403, serveur comprend la requête mais refuse l'autorisation car erreur.
                    } else {
                        sauceModel.findOne({ _id: sauceId }) //On récupère l'id de la sauce concernée.
                            .then((sauce) => {
                                sauceModel.updateOne({ _id: sauceId },
                                    {
                                        $push: { usersLiked: user }, //On ajoute l'userId dans le tableau créé dans le model.
                                        $inc: { likes: 1 }, //On incrémente 1 au like.
                                    })
                                    .then(() => res.status(200).json({ message: 'Votre like a été pris en compte !' }))
                                    .catch((error) => res.status(400).json({ message: error.message }));
                            })
                            .catch((error) => res.status(400).json({ message: error.message }));
                    }
                break;
                case -1:
                    //Si l'utilisateur deslike, et qu'il a déjà cliqué dessus une fois, sinon on fait le nécessaire pour ajouter le dislike.
                    if (usersDisliked.includes(userId)) {
                        res.status(403).json({ error: 'Vous ne pouvez pas Disliker deux fois la même sauce !!' })
                    } else {
                        console.log('Cas -1');
                        sauceModel.findOne({ _id: sauceId })
                            .then((sauce) => {
                                sauceModel.updateOne({ _id: sauceId },
                                {
                                    $push: { usersDisliked: user }, 
                                    $inc: { dislike: 1 },
                                })
                                .then(() => res.status(200).json({ message: 'Votre Dislike a été pris en compte !' }))
                                .catch((error) => res.status(400).json({ message: error.message }));
                            })
                            .catch((error) => res.status(404).json({ message: error.message }));
                    }
                break;
                case 0:
                    //Si l'utilisateur Reclique, il annule ce qu'il aime ou n'iame pas.
                    sauceModel.findOne({ _id: sauceId })
                        .then((sauce) => {
                            //Si l'utilisateur à déjà like, on le retire, Sinon on retire du Dislike
                            if (sauce.userLiked.includes(userId)) {
                                sauce.updateOne({ _id: req.params.id },
                                {
                                    $inc: { likes: -1 }, //On retire le like
                                    $pull: { usersLiked: req.body.userId }, //On retire l'utilisateur du tableau
                                    _id: sauceId
                                })
                                .then(() => { res.status(201).json({ message: 'Nous venons de retirer votre Like' }); })
                                .catch((error) => { res.status(400).json({ message: error.message }); });
                            } else {
                                sauce.updateOne({ _id: req.params.id },
                                {
                                    $inc: { dislikes: -1 }, //On retire un dislike
                                    $pull: { userDisliked: req.body.iserId }, //On retire l'utilisateur du tableau Dislike
                                    _id: sauceId
                                })
                                .then(() => { res.status(201).json({ message: 'Votre Dislike a été retiré' }); })
                                .catch((error) => { res.status(400).json({ message: error.message }) ; });
                            }
                        })
                        .catch((error) => { res.status(500).json({ message: error.message }); });
            }
        })
        .catch((error) => { res.status(500).json({ message: error.message }); });
};