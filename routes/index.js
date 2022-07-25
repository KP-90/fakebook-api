var express = require('express');
var router = express.Router();
const cors = require('cors')

const user_controller = require('../controllers/user_controller')
const post_controller = require('../controllers/post_controller')

// Routes for posts
router.get('/', post_controller.get_all_posts)

router.post('/submitPost', post_controller.submit_post)
router.post('/delete/:id', post_controller.delete_post)
router.post('/edit/:id', post_controller.edit_post)


// Get and Post routes for users
router.get('/all_users', user_controller.get_all_users)
router.get('/me', user_controller.get_self_user)
router.get('/user/:id', user_controller.get_single_user)

router.post('/user/update/:id', user_controller.update_user)
router.post('/user', user_controller.create_user)
router.post('/login', user_controller.login)

// Get and Post routes for comments

module.exports = router;
