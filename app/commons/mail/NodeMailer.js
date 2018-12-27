'use strict'

var nodemailer = require('nodemailer');

class NodeMailer{
    send(options){
        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport(_config('mail').transporter);

            let mailOptions = {
                from    : '"Liberzy VietNam" <no-reply@liberzy.com>',
                to      : options.to,
                subject : options.subject,
                text    : options.text,
                html    : '<b>' + options.text + '</b>'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
            });
        });
    }
}

module.exports = new NodeMailer();