const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce'); 

// Enregistrement d'une sauce dans la base de donnée
router.post('/',auth,multer,sauceCtrl.creationSauce);

// Renvoie une sauce spécifique grâce à l'id
router.get('/:id',auth,sauceCtrl.saucePart);

// Renvoie toutes les sauces sauvegardées dans la base de donnée
router.get('/',auth,sauceCtrl.renvoiAllSauce);

// Modification d'une sauce 

router.put('/:id',auth,multer,sauceCtrl.modifSauce);

// Suppression d'une sauce

router.delete('/:id',auth,sauceCtrl.suppSauce);

// like et dislike sauce

router.post('/:id/like',auth,sauceCtrl.likeSauce);



module.exports = router;
