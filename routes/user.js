//On récupère Express
const express = require('express');

//On prépare la route user
const router = express.Router();

//On récupère la logique métier concernée.
const userCtrl = require('../controllers/user.js');

//Création de la route POST signup
router.post('/signup', userCtrl.signup);

//Création de la route POST login
//router.post('/login', userCtrl.login);

module.exports = router;