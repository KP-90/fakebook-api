const { body, validationResult } = require('express-validator');
const Post = require('../models/Post')

exports.get_all_posts = function(req, res) {
    Post.find({}).sort({date_created: -1}).populate('author').exec(function(err, results) {
        res.json({results})
    })
}

exports.submit_post = [
    body("post_contents", "Issue with contents").trim().isLength({min:1}),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("STEP 2 REACVHED")
        let newPost = new Post({
            author: req.body.id,
            post_contents: req.body.post_contents
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
]

// DELETE a post
exports.delete_post = function(req, res) { 
    Post.findByIdAndDelete(req.params.id).exec((err, doc) => {
        if(err) {res.json({errors: err, msg: "Error deleting post"})}
        res.sendStatus(200)
    })
}

// Used to make edits to a post. Fetch request will need the original object and a 'payload' object containing the changes.
exports.edit_post = [
    body('payload.post_contents').optional({nullable: true}).trim().isLength({min: 1}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ ok: false, errors: errors, msg: "Errors are present"});
        }
        Post.findOneAndUpdate({_id: req.body._id}, req.body.payload).exec((err, doc) => {
            if(err) {res.json({ok:false, errors: err})}
            res.sendStatus(200)
        })
    }
]

exports.get_liked_posts = function(req, res) {
    Post.find({likes: req.params.id}).populate('author').exec((err, results) => {
        res.json({posts: results})
    })
}