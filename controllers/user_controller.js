const { body,validationResult } = require('express-validator');
const User = require('../models/User')
const cors = require('cors')


exports.get_all_users = function(req, res) {
    User.find().exec((err, result) => {
        res.json({users: result})
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

exports.login = function(req, res) {
    User.findOne({username: req.body.username}).exec((err, result) => {
        console.log(result)
        if(result === null || result.password !== req.body.password) {
            res.json({err: err, msg: "Username and password dont match"})
        }
        else {
            res.json({user: result})
        }
    })
}