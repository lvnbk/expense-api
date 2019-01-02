const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const ValidationError = require('../commons/errors/ValidationError');
const LogicError = require('../commons/errors/LogicError');
const User = require('../models/Users');
const _30s = require('30-seconds-of-code');

class Authentication {
    constructor() {
        this.handle = this.handle.bind(this);
    }

    async handle(req, res, next) {
        try{
            const user_id = await this.jwtVerify(req.headers.authorization);
            const user = await User.findOne({_id: user_id});

            if(_30s.isNull(user)) {
                throw new LogicError({
                    message: 'User not found'
                })
            }

            req.user = user;
            next();
        }catch (err) {
            next(err);
        }

    }

    async jwtVerify(authorization) {
        return await new Promise((resolve, reject) => {
            const [type, token] = authorization.split(' ');
            if (type !== 'Bearer') reject(new ValidationError({
                field: "access_token",
                message: 'Type is invalid'
            }));

            jwt.verify(token, jwtConfig.secret, function (err, decode) {
                if(err) return reject(err);

                resolve(decode.data);
            })
        }).catch(e => {
            throw new ValidationError([{
                field: "access_token",
                message: e.message
            }])
        });
    }
}

module.exports = new Authentication().handle;