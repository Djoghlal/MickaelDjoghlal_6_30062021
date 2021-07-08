//On importe les modules supplémentaires
const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce.js');
const auth = require('../middlewares/auth.js');
const multer = require('../middlewares/multer-config.js');

//On intègre la liaison entre les routes et le controller
router.post('/', auth, multer, sauceCtrl.createSauce);      //C (CREATE)
//Route concernant le like                                  //C (CREATE)
router.get('/', auth, sauceCtrl.sauce);                     //R (READ)
router.get('/:id', auth, sauceCtrl.getOneSauce);            //R (READ)
//Route pour modifier une sauce                             //U (UPDATE)
//Route pour supprimer une sauce                            //D (DELETE)

module.exports = router;