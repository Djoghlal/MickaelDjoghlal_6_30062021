const rateLimit = require("express-rate-limit");

exports.limiter = rateLimit({
    windowMs: 60 * 60 * 1000, //Sanction pendant 1h si tentative de mot de passe
    max: 5 //Nombre de tentative limite.

    //ERREUR 401, Erreur d'authentification.
    //ERREUR 429, trop de requête envoyé par l'utilisateur.
});