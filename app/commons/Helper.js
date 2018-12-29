var bcrypt     = require('bcrypt');
var jwt        = require('jsonwebtoken');
// let jwtConfig  = require('config/jwt');
var saltRounds = 10;
var salt       = bcrypt.genSaltSync(saltRounds);
var mongoose = require("mongoose");

const Helper = {
    change_alias: (alias, space = true) => {
        var str = alias;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
        str = str.replace(/đ/g,"d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        str = str.replace(/ + /g," ");
        if(space) str = str.replace(/ /g,"");
        str = str.trim();
        return str;
    },

    password_encode: async (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds).then(function (hash) {
                return resolve(hash);
            });
        });
    },

    password_compare: async (password, hashPassword) => {
        try {
            return await bcrypt.compare(password, hashPassword);
        } catch(e) {
            return false;
        }
    },

    // generate_token: (user_id) => {
    //     return jwt.sign(
    //         { data: user_id },
    //         jwtConfig.superSecret,
    //         {expiresIn: jwtConfig.expiresIn}
    //     );
    // },

    email_checker: (str) => {
        let email_check = ["@gmail.com", "@Outlook.com", "@yahoo.com", "@inbox.com", "@mail.com"];
        let check = email_check.filter((data, index) => {
            return str.indexOf(data) !== -1
        })
        if(check.length === 0)
            return false;
        else
            return new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ig).test(str);
    },

    phonenumber_checker: (value) =>{
        return new RegExp(/(0[9|8]|01[2|6|8|9])+([0-9]{8})\b/g).test(value);
    },

    generate_verify_code: (length = 6) => {
        // return '123456';
        let max = Math.pow(10, length) - 1;
        let min = Math.pow(10, (length -1));
        return Math.floor(Math.random() * (max - min) + min);
    },

    generate_random_string: (length = 32) =>{
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },

    validation_rules: (attrs) =>{
        let defined = _config('validation-rules');
        let result  = {};
        let {rule}    = require('indicative');
        let DD_MM_YYYY = new RegExp('^$|^(0[1-9]|1\\d|2\\d|3[01])\\/(0[1-9]|1[0-2])\\/(19|20)\\d{2}$', 'g');

        attrs.forEach(function(item, index){
            if(item === 'day_of_birth')
                result[item] = [rule('regex', DD_MM_YYYY)];
            else
                result[item] = defined[item];
        });
        return result;
    },

    validation_messages: () =>{
        return _config('validation-messages');
    },

    convert_coordinate: (coordinate) =>{
        return coordinate.lat + ',' + coordinate.lng;
    },

    convert_phone_number: (phone_number) => {
        return phone_number.replace('0', '84');
    },

    generate_verify_text: (verify_code) => {
        return "Mã xác nhận của bạn là: " + verify_code;
    },

    count_itinerary_cost: (schedule) => {
        let sum = 0;
        schedule.forEach(element => {
            element.forEach(value => {
                sum = parseInt(sum) + parseInt(value.cost)
            });
        });
        return sum;
    },

    pagination: (query) => {
        let page  = parseInt(query.page) - 1;
        let limit = parseInt(query.limit) || 10;

        return {
            page  : page < 0 ? 0 : page,
            limit : limit < 0 ? 10 : limit > 100 ? 100 : limit
        }
    },

    optionPaginate: (page, selectFields, populate, limit = 5) => {
        return {
            select: selectFields,
            sort: { _id: -1 },
            page: page,
            limit: limit,
            populate: populate
        }
    },

    isMongoId:(id) => {
        return ObjectId.isValid(id);
    },

    daysInMonth: (month, year) => {
        return new Date(year, month, 0).getDate();
    },

    isNumber: (number) => {
        return !!Number(number);
    },

    numberInt: (number, def) => {
        const check = Helper.isNumber(number);
        if (!check)
            return def;
        return parseInt(number);
    },

    statiticDate: (model, month, date, year) => {
        return model.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)),
                        $lt: new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
                    }
                }
            },
            {
                $project: {
                    "date": {
                        "$dayOfMonth": "$createdAt"
                    }
                }
            },
            {
                $group : {
                    _id : "$date",
                    total : {
                        $sum : 1
                    }
                }
            },
            {
                $addFields: {
                    date: "$_id",
                    month: month,
                    year: year,
                    datesOfMonth: date
                }
            }
        ]);
    },

    statiticMonth: (model, year) => {
        return model.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
                        $lt: new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0))
                    }
                }
            },
            {
                $project: {
                    "month": {
                        "$month": "$createdAt"
                    }
                }
            },
            {
                $group : {
                    _id : "$month",
                    total : {
                        $sum : 1
                    }
                }
            },
            {
                $addFields: {
                    month: "$_id",
                    year: year
                }
            }
        ]);
    },

    statiticYear: (model) => {
        return model.aggregate([
            {
                $project: {
                    "year": {
                        "$year": "$createdAt"
                    }
                }
            },
            {
                $group : {
                    _id : "$year",
                    total : {
                        $sum : 1
                    }
                }
            },
            {
                $addFields: {
                    label: "$_id"
                }
            }
        ]);
    },

    statiticUseSystem: (model, date) => {
        return model.aggregate([
            {
                $group : {
                    _id : "$user",
                    total : {
                        $sum : 1
                    },
                    createdAt: {
                        $max: "$createdAt"
                    }
                }
            },
            {
                $match: {
                    createdAt: {
                        $lt: date.toDate()
                    }
                }
            }
        ]);
    },

    toObjectId: (id) => {
        return mongoose.Types.ObjectId(id);
    },

    toString: (text) => {
        return text.toString();
    },

    activyMore2Week: (model, date) => {
        return model.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: date.toDate()
                    }
                }
            },
            {
                $group : {
                    _id : "$user",
                    total : {
                        $sum : 1
                    }
                }
            },
            {
                $match: {
                    total: {
                        $gte: 2
                    }
                }
            }
        ]);
    },

    getImagePath (path) {
        if(path.includes('http://') || path.includes('https://')) {
            for(let i = path.length - 1; i > 0; i--) {
                if(path[i] === '/') {
                    return path.substring(i + 1, path.length);
                }
            }
        }
        return path;
    },

    encodeInfo: (data) => {
        return [...data].map((char, index) => {
            if(index < data.length - 3) {
                return "*"
            }
            return data[index]
        }).join('')
    },

    truncateText : (text, maxLength) => {
        if (!maxLength) maxLength = 20;
        if (text===undefined || text === null)
            return null;
        if (text.length > maxLength) {
            text = text.substr(0,maxLength) + '...';
        }
        return text;
    },

    arrFlatten(arr) {
        return [].concat(...arr.map(v => (Array.isArray(v) ? this.arrFlatten(v) : v)))
    }

};

module.exports = Helper;
