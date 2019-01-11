var express = require('express');
var router = express.Router();
const UserController = require('../app/controllers/UserController');
const Authentication = require('../app/middlewares/Authentication');
const request = require('request-promise');

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

router.post('/facebook-search', (req, res) => {
    const queryTerm = 'Fiat';
    const searchType = 'user';

    const userFieldSet = 'name, link, is_verified, picture';
    const pageFieldSet = 'name, category, link, picture, is_verified';

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/search',
        qs: {
            access_token: req.body.access_token,
            q: queryTerm,
            type: searchType,
            fields: userFieldSet
        }
    };

    request(options)
        .then(fbRes => {
            // Search results are in the data property of the response.
            // There is another property that allows for pagination of results.
            // Pagination will not be covered in this post,
            // so we only need the data property of the parsed response.
            const parsedRes = JSON.parse(fbRes).data;
            console.log('parsedRes', request);
            res.json(parsedRes);
        }).catch(err => {
        console.log('error', err);
        res.json(err);
    });
});

module.exports = router;
