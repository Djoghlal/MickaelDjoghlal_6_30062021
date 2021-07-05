const express = require('express'); //On récupère Express
const router = express.Router(); //On prépare la route sauce

const auth = require('../middlewares/auth.js'); //On récupère le middleware du token.
const sauceCtrl = require('../controllers/sauce.js'); //On récupère la logique métier concernée.

router.post('/', auth, sauceCtrl.createSauce);      //C (CREATE)
router.get('/sauces', sauceCtrl.sauce);             //R (READ)

module.exports = router;