const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce'); 

// Enregistrement d'une sauce dans la base de donnée
router.post('/', sauceCtrl.creationSauce);

// Renvoie une sauce spécifique grâce à l'id
app.get('/:id ', sauceCtrl.saucePart);

// Renvoie toutes les sauces sauvegardées dans la base de donnée
app.get('/', sauceCtrl.renvoiAllSauce);

// Modification d'une sauce 

app.put('/:id', sauceCtrl.modifSauce);

// Suppression d'une sauce

app.delete('/:id', sauceCtrl.suppSauce);


module.exports = router;
