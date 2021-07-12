//On importe les modules supplémentaires
const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce.js');
const auth = require('../middlewares/auth.js');
const multer = require('../middlewares/multer-config.js');

//On intègre la liaison entre les routes et le controller
router.post('/', auth, multer, sauceCtrl.createSauce);          //C (CREATE)
router.post('/:id/like', auth, sauceCtrl.sauceLike);            //C (CREATE)
router.get('/', auth, sauceCtrl.sauces);                        //R (READ)
router.get('/:id', auth, sauceCtrl.getOneSauce);                //R (READ)
router.put('/:id', auth, multer, sauceCtrl.modifyOneSauce);     //U (UPDATE)
router.delete('/:id', auth, multer, sauceCtrl.deleteOneSauce);  //D (DELETE)

module.exports = router;