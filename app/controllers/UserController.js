const Users = require('../models/Users');
const Helper = require('../commons/Helper');
const request = require('request-promise');

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

    async registerFacebook(body, err, next) {
        // you'll need to have requested 'user_about_me' permissions
        // in order to get 'quotes' and 'about' fields from search
        const userFieldSet = 'name, link, is_verified, picture';
        const pageFieldSet = 'name, category, link, picture, is_verified';
    }
}

module.exports = UserController;