'use strict';

var ValidationError = _facade('Error/ValidationError');

const { validateAll } = require('indicative');

module.exports = class Request{
    constructor(){
        this.handle = this.handle.bind(this);
    }

    handle(req, res, next){
        let rules       = Helper.validation_rules(this.rules);
        // let messages    = Helper.validation_message(this.messages);

        const data = {
            ...req.body
        }

        validateAll(data, rules, this.messages)
            .then(() => {
                next();
            })
            .catch((errors) => {
                next(new ValidationError(errors));
        })
    }
}