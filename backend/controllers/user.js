const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            console.log(user);
            user.save()
                .then(() => res.status(201).json({message: 'utilisateur créé !'}))
                
        })
    
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then( user => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non inscrit'})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Motde passe inccorect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                           { userId: user._id},
                           'RANDOM_TOKEN_SECRET',
                           { expriresIn: '24h'}
                        )
                    });
                })
                .catch( error => res.status(500).json({error}));
        })
        .catch( error => res.status(500).json({error}));

}