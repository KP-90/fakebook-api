const { body, validationResult } = require('express-validator');
const Post = require('../models/Post')

exports.get_all_posts = function(req, res) {
    Post.find().exec(function(err, results) {
        res.json(results)
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
                res.json({status: '200'})
            }
        })
        console.log("END REACHED")
    }
]