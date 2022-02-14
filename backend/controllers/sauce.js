//importation du modele sauce
const Sauce = require('../models/sauce');
//importation du gestionnaire de fichier node
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Enregistrement d'une sauce dans la base de donnée
exports.creationSauce = (req, res, next) => {
  console.log(req);
  const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({message: 'Sauce enregistrée'}))
      .catch( error => res.status(400).json({error}));
};

// Renvoie une sauce spécifique grâce à l'id
exports.saucePart = (req, res, next) => {
  console.log('test0');
    Sauce.findOne({_id: req.params.id})
      .then(thingsSauces => res.status(200).json(thingsSauces))
      .catch(error => res.status(404).json({error}));
};

// Renvoie toutes les sauces sauvegardées dans la base de donnée
exports.renvoiAllSauce = (req, res, next) => {
    Sauce.find()
      .then(thingsSauces => res.status(200).json(thingsSauces))
      .catch(error => res.status(400).json({error}));
};

// Modification d'une sauce 
exports.modifSauce = (req, res, next) => {
    if (!req.file) {
    const sauceObject = { ...req.body };
    Sauce.updateOne({ _id: req.params.id },{ ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
    }else{
      Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          const sauceModif = {
            ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          };
          Sauce.updateOne({ _id: req.params.id },{ ...sauceModif, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
    }
};

// Si le client Like la sauce 

exports.likeSauce = (req, res) => {
  
  /* Si le client Like cette sauce */
  if (req.body.like === 1) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

    /* Si le client disike cette sauce */
  } else if (req.body.like === -1) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

    /* Si le client annule son choix */
  } else {
    Sauce.findOne({ _id: req.params.id }).then((resultat) => {
      if (resultat.usersLiked.includes(req.body.userId)) {
        Sauce.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "like retiré !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (resultat.usersDisliked.includes(req.body.userId)) {
        Sauce.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "dislike retiré !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }
};

// Suppression d'une sauce
exports.suppSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
  .then((thingsSauces) => {
    // est ce que l'id stocké dans le token est le même que l'id du créateur de la sauce
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (thingsSauces.userId == userId) {
      const filename = thingsSauces.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
        .catch((error) => res.status(400).json({ error }));});
    }else{
      throw 'Vous ne pouvez pas supprimer cette sauve Aurevoir !!!';
    }; 
  })
  .catch((error) => res.status(500).json({ error }));
};
