const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, //Identifiants unique pour l'utilisateur qui a créé la sauce.
    name: { type: String, required: true }, //Nom de la sauce.
    manufacturer: {type: String, required: true }, //Fabricant de la sauce.
    description: {type: String, required: true }, //Description de la sauce.
    mainPepper: {type: String, required: true }, //Principal ingrédient dans la sauce.
    imageUrl: {type: String, required: true }, //String de l'image de la sauce téléchargée par l'utilisateur.
    heat: {type: Number, required: true }, //nombre entre 1 et 10 décrivant la sauce.
    likes: {type: Number, required: true }, //Nombre d'utilisateur qui aiment la sauce.
    dislikes: {type: Number, required: true }, //Nombre d'utilisateur qui n'aiment pas la sauce.
    userLiked: {type: [String], required: true }, //Tableau d'identifiants d'utilisateurs qui ont aimé la sauce.
    userDisliked: {type: [String], required: true }, //Tableau d'identifiants d'utilisateurs qui n'ont pas aimé la sauce.
})

module.exports = mongoose.model('Sauce', sauceSchema);