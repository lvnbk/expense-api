const Users = require('../models/Users');
const Helper = require('../commons/Helper');
const util = require('util');
const AndrisFetch = require('../commons/http/AndrisFetch');

const graphUrl = 'https://graph.facebook.com';
const version = 'v2.11';
const fields = ['picture.width(200).height(200)', 'name', 'email', 'gender', 'verified', 'link'];

class UserController {
    async create(body, err, next) {
        const user = new Users({
            first_name: body.first_name,
            last_name: body.last_name,
            username: body.username,
            email: body.email,
            password: await Helper.password_encode(body.password),
        });

        user.save(function(error) {
           if(error) {
               err(error);
           }

           next(user);
        });
    }

    async getUserInfoFacebook(access_token) {
        let url = util.format('%s/%s/me?access_token=%s&fields=%s', graphUrl, version, access_token, fields);
        let response = await AndrisFetch.fetch(url);

        console.log('getUserInfoFacebook response', response);
    }
}

module.exports = new UserController();