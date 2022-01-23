const sauce = require('../models/thingSauce');

// Enregistrement d'une sauce dans la base de donnée
exports.creationSauce = (req, res, next) => {
    delete req.body._id;
    const thingSauce = new thingSauce({
        ...req.body
    });
    thingSauce.save()
      .then(() => res.status(201).json({message: 'Sauce enregistrée'}))
      .catch( error => res.status(400).json({error}));
};

// Renvoie une sauce spécifique grâce à l'id
exports.saucePart = (req, res, next) => {
    thingSauce.findOne({userId: req.params.id})
      .then(thingsSauces => res.status(200).json(thingsSauces))
      .catch(error => res.status(404).json({error}));
};

// Renvoie toutes les sauces sauvegardées dans la base de donnée
exports.renvoiAllSauce = (req, res, next) => {
    thingSauce.find()
      .then(thingsSauces => res.status(200).json(thingsSauces))
      .catch(error => res.status(400).json({error}));
};

// Modification d'une sauce 
exports.modifSauce = (req, res, next) => {
    thingSauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
      .then(() => res.status(200).json({message: 'objet modifié !'}))
      .catch(error => res.status(400).json({error}));
};


// Suppression d'une sauce
exports.suppSauce = (req, res, next) => {
    thingSauce.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({error}));
};

