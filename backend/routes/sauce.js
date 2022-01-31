const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce'); 

// Enregistrement d'une sauce dans la base de donnée
router.post('/', sauceCtrl.creationSauce);

// Renvoie une sauce spécifique grâce à l'id
router.get('/:id ', sauceCtrl.saucePart);

// Renvoie toutes les sauces sauvegardées dans la base de donnée
router.get('/', sauceCtrl.renvoiAllSauce);

// Modification d'une sauce 

router.put('/:id', sauceCtrl.modifSauce);

// Suppression d'une sauce

router.delete('/:id', sauceCtrl.suppSauce);

// like et dislike sauce

router.post('/:id/like',sauceCtrl.likeSauce);



module.exports = router;
