const express = require('express'); //On récupère Express
const router = express.Router(); //On prépare la route user

const userCtrl = require('../controllers/user.js'); //On récupère la logique métier concernée.
const Limiter = require('../middlewares/rate-limit.js'); //Importation de rate-limit


router.post('/signup', userCtrl.signup); //Création de la route POST signup
router.post('/login', Limiter.limiter, userCtrl.login); //Création de la route POST login

module.exports = router;