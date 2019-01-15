const Users = require('../models/Users');
const Helper = require('../commons/Helper');
const util = require('util');
const AndrisFetch = require('../commons/http/AndrisFetch');

const graphUrl = 'https://graph.facebook.com';
const version = 'v2.11';
const fields = ['picture.width(200).height(200)', 'name', 'email', 'gender', 'verified', 'link'];

const googleUrl = 'https://www.googleapis.com/plus/v1/people/me';

class UserController {
    constructor() {
        this.user = Users;
    }

    async create(body, err, next) {
        const user = new Users({
            first_name: body.first_name,
            last_name: body.last_name,
            username: body.username,
            email: body.email,
            password: await Helper.password_encode(body.password),
        });

        user.save(function (error) {
            if (error) {
                err(error);
            }

            next(user);
        });
    }

    async getUserInfoFacebook(access_token) {
        let url = util.format('%s/%s/me?access_token=%s&fields=%s', graphUrl, version, access_token, fields);
        try {
            let response = await AndrisFetch.fetch(url);
            let socialId = response.id;
            let userDatabase = await Users.findOne({socialId});

            if (userDatabase) {
                return userDatabase;
            } else {
                let user = {
                    socialId: response.id,
                    name: response.name,
                    email: response.email,
                    avatar: response.picture.data.url,
                    type: 'FACEBOOK'
                };

                Users.create(user, (err, user) => {
                    if (err) return console.log(err);
                    console.log('create user ok', user);
                    return user;
                });

                return user;
            }
        } catch (e) {
            console.log('error', e);
        }
    }

    async getUserInfoGoogle(access_token) {
        let url = util.format('%s?access_token=%s', googleUrl, access_token);
        let response = await AndrisFetch.fetch(url);

        let user = {
            socialId: response.id,
            name: response.displayName,
            email: response.emails[0].value,
            avatar: response.image.url,
            type: 'GOOGLE'
        };

        console.log('response google', user);
    }
}

module.exports = new UserController();