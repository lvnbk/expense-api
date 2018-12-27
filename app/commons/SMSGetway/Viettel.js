'use strict'

var soap = require('strong-soap').soap;
const config = _config('services').viettel

class Viettel {
    send(number, message) {
        let args = {
            User        : config.username,
            Password    : config.password,
            CPCode      : config.cpcode,
            RequestID   : 1,
            UserID      : number,
            ReceiverID  : number,
            ServiceID   : config.alias,
            CommandCode : "bulksms",
            Content     : message,
            ContentType : 1
        };

        let options = {};
        return soap.createClient(config.uri, options, function (err, client) {
            if(err){
                throw err;
            }
            var method = client['wsCpMt'];
            method(args, function (err, result, envelope, soapHeader) {
                console.log('Result: \n' + JSON.stringify(result));
            });
        });
    }
}

module.exports = new Viettel();