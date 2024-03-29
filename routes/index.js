var express = require('express');
var router = express.Router();
const cors = require('cors')

const user_controller = require('../controllers/user_controller')
const post_controller = require('../controllers/post_controller')
const comment_controller = require('../controllers/comment_controller')

router.get('/ping', (req, res) => {
    res.json({'ok': true, 'msg': "Connection confirmed"})
})

// Routes for POSTS
router.get('/', post_controller.get_all_posts)
router.get('/liked/:id', post_controller.get_liked_posts)

router.post('/submitPost', post_controller.submit_post)
router.post('/delete/:id', post_controller.delete_post)
router.post('/edit/:id', post_controller.edit_post)


// Get and Post routes for USERS
router.get('/all_users', user_controller.get_all_users)
router.get('/me', user_controller.get_self_user)
router.get('/user/:id', user_controller.get_single_user)

router.post('/user/update/:id', user_controller.update_user)
router.post('/user', user_controller.create_user)
router.post('/login', user_controller.login)
router.post('/user/delete/:id', user_controller.delete_user)

// Get and Post routes for COMMENTS
router.get('/comments/:id', comment_controller.get_comments)

router.post('/comments/:id', comment_controller.post_comment)
router.post('/comments/delete/:id', comment_controller.delete_comment)
router.post('/comments/edit/:id', comment_controller.edit_comment)



module.exports = router;