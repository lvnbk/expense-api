const Users = require('../models/Users');
const Helper = require('../commons/Helper');

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
}

module.exports = UserController;