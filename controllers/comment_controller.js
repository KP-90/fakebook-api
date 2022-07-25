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
    }).save(err => {
        console.log("ATTEMPTING SAVE")
        if(err) {
            console.log("ERR", err)
            res.json({errors: err})
        }
        else{
            console.log("COMPLETED")
            res.json({ok:true})
        }
    })
}