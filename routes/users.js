var express = require('express');
var router = express.Router();
const UserController =  require('../app/controllers/UserController');
const Authentication  = require('../app/middlewares/Authentication');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/*
  POST user. Create user.
 */
router.post('/create-user', function (req, res, next) {
    console.log('create user');
    new UserController().create(req.body, (err) => {
        res.json({
            error: true,
            message: err.message,
        })
    }, (user) => {
        res.json({
            error: false,
            message: 'create user successfully !',
            data: user
        })
    })
});

router.get('/friends', Authentication, function(req, res, next) {
    res.json({message: 'friends'});
});

module.exports = router;
