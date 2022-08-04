const { body,validationResult } = require('express-validator');
const User = require('../models/User')
const Post = require('../models/Post')
const Comments = require('../models/Comments')
const cors = require('cors')
const bcrypt = require('bcryptjs')
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
    body("confirm_pass").isLength({min: 5}).withMessage("Password not long enough").custom((value, {req}) => {
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
        bcrypt.hash(req.body.password, 2, function(err, hash) {
            let newUser = new User({
                first: req.body.first,
                last: req.body.last,
                username: req.body.username,
                password: hash
            }).save(err => {
                if(err) {return res.json({errors: err, msg:"Error saving user"})}
                res.json({ok:true})
            })
        })
        
    }
]

// Log in path, returns a token and the user
exports.login = function(req, res) {
    
    User.findOne({username: req.body.username}).exec((err, user) => {
        // If no user found, return error
        if(user === null) {
            res.json({errors: true, msg: "Incorrect username/password combination"})
            return
        }
        // compare the password with thye hashed password
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if(result === true) {
                // Create a token and send it to the client.
                jwt.sign({user}, 'secret', (err, token) => {
                    res.json({token: token, msg: "Success"})
                })
            } else {
                res.json({errors: err, msg: "Incorrect username/password combination"})
            }
        })
    })
}

// Delete entire user, including posts, friend requests, and current friends
exports.delete_user = function(req, res) {
    console.log("INITIATING USER DELETE PROCESSS")
    console.log(req.params.id)
    async.parallel([
        function(callback) {
            User.findByIdAndDelete(req.params.id).exec(callback)
        },
        function(callback) {
            Post.deleteMany({author: req.params.id}).exec(callback)
        },
        function(callback) {
            Comments.deleteMany({author: req.params.id}).exec(callback)
        },
        // delete from all friends, pending_friends, and Post likes arrays
        function(callback) {
            Post.updateMany({likes: req.params.id}, {
                $pullAll: {
                    likes: req.params.id
                }
            }).exec(callback)
        },
        function(callback) {
            User.updateMany({pending_friends: req.params.id}, {
                $pullAll: {
                    pending_friends: req.params.id
                }
            }).exec(callback)
        },
        function(callback) {
            User.updateMany({friends: req.params.id}, {
                $pullAll: {
                    friends: req.params.id
                }
            }).exec(callback)
        }
    ], function(err, results) {
        res.json({msg: "deletion acheived"})
    }) 
}