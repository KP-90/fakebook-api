var express = require('express');
var router = express.Router();
const cors = require('cors')

const user_controller = require('../controllers/user_controller')
const post_controller = require('../controllers/post_controller')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Affirmative\n")
});

// Routes for posts

router.post('/submitPost', post_controller.submit_post)


// Get and Post routes for users
router.get('/all_users', user_controller.get_all_users)
router.get('/me', user_controller.get_self_user)
router.get('/user/:id', user_controller.get_single_user)
router.post('/user/update/:id', user_controller.update_user)
router.post('/user', user_controller.create_user)
router.post('/login', user_controller.login)

function verifyToken(req, res, next) {
  const bearHeader = req.headers['authorization']

  if(typeof bearHeader !== 'undefined') {
    const bearer = bearHeader.split(' ')
    req.token = bearer[1]
    console.log("Verified Toekn")
    next()
  }
  else {
    console.log("NO TOKEN")
      res.sendStatuss(403)
  }
}

module.exports = router;
