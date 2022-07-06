var express = require('express');
var router = express.Router();
const cors = require('cors')

const user_controller = require('../controllers/user_controller')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Affirmative\n")
});

// Get and Post routes for users
router.get('/user', user_controller.get_all_users)
router.get('/user/:id', user_controller.get_user)
router.post('/user', user_controller.create_user)
router.post('/login', user_controller.login)

module.exports = router;
