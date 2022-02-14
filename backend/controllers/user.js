const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user');

// Creation de compte

const passwordValidator = require("password-validator");
const schema = new passwordValidator(); //Création d'un schema avec le module password-validator pour un mots de passe sécurisé.
schema
    .is().min(8)
    .has().digits(1)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().symbols(1)
    .has().not().spaces();

exports.signup = (req, res, next) => {
    if (!schema.validate(req.body.password)) {
        //Renvoie une erreur si le schema de mot de passe si le mots de passe ne respecte pas le schema definis. 
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères, un chiffre, une majuscule, une minuscule, un symbole et ne pas contenir d'espace !" });
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            console.log(user);
            user.save()
                .then(() => res.status(201).json({message: 'utilisateur créé !'}))
                .catch(() => res.status(400).json({message: 'Cette adresse e-mail est déjà utilisée par un autre utilisateur !'}));
        })
        .catch(error => res.status(500).json({error}));
};

// Connexion de l'utilisateur

exports.login = (req, res, next) => {
    console.log(req);
    User.findOne({email: req.body.email})
        .then( user => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non inscrit'})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe inccorect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                           { userId: user._id},
                           'RANDOM_TOKEN_SECRET',
                           { expiresIn: '24h'}
                        )
                    });
                })
                .catch( error => res.status(500).json({error}));
        })
        .catch( error => res.status(500).json({error}));
}


  