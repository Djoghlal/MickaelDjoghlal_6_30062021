const express = require('express'); //On récupère Express
const router = express.Router(); //On prépare la route user

const auth = require('../middlewares/auth.js'); //On récupère le middleware du token.
const userCtrl = require('../controllers/user.js'); //On récupère la logique métier concernée.

router.post('/signup', userCtrl.signup); //Création de la route POST signup
router.post('/login', userCtrl.login); //Création de la route POST login

module.exports = router;