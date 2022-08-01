const { body,validationResult } = require('express-validator');
const User = require('../models/User')
const Post = require('../models/Post')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const async = require('async')

exports.get_self_user = function(req, res) {
    let token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.verify(token, "secret");
    if(decoded.user) {
        async.parallel({
            currentUser: function(callback) {
                User.findById(decoded.user._id).populate('pending_friends').populate('friends').exec(callback)
            },
            posts: function(callback) {
                Post.find({author: decoded.user._id}).populate('author').exec(callback)
            }
        }, function(err, results) {
            if(err) {res.json({errors: err})}
            res.json({user: results.currentUser, posts: results.posts})
        })
    }
}

exports.get_single_user = function(req, res) {
    async.parallel({
        userDetails: function(callback) {
            User.findOne({_id: req.params.id}, {password: 0}).populate('friends').exec(callback)
        },
        postsByUser: function(callback) {
            Post.find({author: req.params.id}).populate('author').exec(callback)
        }
    }, function(err, results) {
        if(err) {res.json({errors: err})}
        res.json({user:results.userDetails, posts:results.postsByUser})
    })
}

exports.get_all_users = function(req, res) {
    return User.find({}).exec((err, result) => {
        if(err){res.json({errors: err, msg: "Error retrieving users"})}
        res.json({user: result})
    })
}

// Fetch will need the body to contain the entire user model and a payload object.
exports.update_user = function(req, res) {   
    console.log(req.body)
    User.findOneAndUpdate({_id: req.body._id}, req.body.payload, {new: true}).populate('pending_friends').populate('friends').exec((err, result) => {
        if(err) {res.json({msg: "There was an error", error: err})}
        res.json({ok: true, info: result})
    })
}


exports.create_user = [
    body('first').not().isEmpty().trim().escape(),
    body('username').trim().custom(async (username) => {
        return User.findOne({username:username}).then(result => {
            if(result !== null) {
                throw new Error("Username Taken")
            }
            return true
        })
    }),
    body("confirm_pass").custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true
    }),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }
        let newUser = new User({
            first: req.body.first,
            last: req.body.last,
            username: req.body.username,
            password: req.body.password
        }).save(err => {
            if(err) {return res.json({errors: err, msg:"Error saving user"})}
            res.json({ok:true})
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
                res.json({token})
            })
        }
    })
}


