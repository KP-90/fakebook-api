const Comment = require('../models/Comments')

exports.get_all_comments = function(req, res) {
    Comment.find().exec((err, results) => {
        res.json({num_comments: results.length})
    })
}

exports.get_comments = function(req, res) {
    Comment.find({parentPost: req.params.id}).populate('author').exec((err, results) => {
        res.json({results: results})
    })
}

exports.post_comment = function(req, res) {
    console.log("Activating comment")
    let newComment = new Comment({
        author: req.body.author,
        comment: req.body.comment,
        parentPost: req.body.parentPost,
    }).save((err, doc) => {
        console.log("ATTEMPTING SAVE")
        if(err) {
            console.log("ERR", err)
            res.json({errors: err})
        }
        else{
            console.log("COMPLETED")
            res.json({ok:true, comment: doc})
        }
    })
}

exports.delete_comment = function(req, res) {
    Comment.findByIdAndDelete(req.params.id).exec((err, doc) => {
        if(err) {res.json({errors: err, msg: "Something went wrong"})}
        res.sendStatus(200)
    })
}

exports.edit_comment = function(req, res) {
    Comment.findOneAndUpdate({_id: req.body._id}, req.body.payload).exec((err, doc) => {
        if(err) {res.json({errors: err, msg:"Error updating item"})}
        res.sendStatus(200)
    })
}