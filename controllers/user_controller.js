const { body,validationResult } = require('express-validator');
const User = require('../models/User')
const cors = require('cors')
const jwt = require('jsonwebtoken')


exports.get_all_users = function(req, res) {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if(err) {res.sendStatur(403)}
        else{
            User.find().exec((err, result) => {
                res.json({users: result, authData})
            })
        }
    })
}

exports.get_user = function(req, res) {
    return User.findById(req.params.id).exec((err, result) => {
        res.json({user: result})
    })
}

exports.create_user = [
    body('username').custom(async (username) => {
        return User.findOne({username:username}).then(result => {
            if(result !== null) {
                return Promise.reject("Username Taken")
            }
        })
    }),
    (req, res) => {
        let newUser = new User({
            first: req.body.first,
            last: req.body.last,
            username: req.body.username,
            password: req.body.password
        }).save(err => {
            if(err) {return res.json({err: err, msg:"Error saving user"})}
            res.send(200)
        })
    }
]

// Log in path, returns a token and the user
exports.login = function(req, res) {
    User.findOne({username: req.body.username}).exec((err, user) => {
        if(user === null || user.password !== req.body.password) {
            res.json({err: err, msg: "Username and password dont match"})
        }
        else {
            jwt.sign({user}, 'secret', (err, token) => {
                res.json({token, user})
            })
        }
    })
}


