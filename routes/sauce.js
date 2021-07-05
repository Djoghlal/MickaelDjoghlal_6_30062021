const express = require('express'); //On récupère Express
const router = express.Router(); //On prépare la route user

const sauceCtrl = require('../controllers/sauce.js'); //On récupère la logique métier concernée.

router.get('/sauces', sauceCtrl.sauce); //Création de la route GET sauces

module.exports = router;