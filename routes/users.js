var express = require('express');
var router = express.Router();
const UserController = require('../app/controllers/UserController');
const Authentication = require('../app/middlewares/Authentication');
const request = require('request-promise');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../app/config/jwt');

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

router.get('/friends', Authentication, function (req, res, next) {
    if (req.error) {
        res.json(req.error);
    }
    res.json({message: 'friends'});
});

router.post('/login-facebook', async (req, res) => {
    console.log('access_token', req.body.access_token);
    let user = await UserController.getUserInfoFacebook(req.body.access_token);

    let jsonToken = jwt.sign({user_id: user._id}, jwtConfig.secret);

    console.log('jsonToken post', jsonToken);

    jwt.verify(jsonToken, jwtConfig.secret, (err, decode) => {
        if(err) return console.log('err', err);
        console.log('decode', decode);
    })

});

router.post('/login-google', (req, res) => {
    console.log('access_token', req.body.access_token);

    UserController.getUserInfoGoogle(req.body.access_token);
});

router.get('/me', Authentication, async (req, res) => {
    if(req.error) {
        res.json({
            data: null,
            message: req.error.message,
            error: true
        });
    }

    res.json({
        data: req.user,
        message: 'Get user info successfully',
        error: false
    })
});

module.exports = router;
