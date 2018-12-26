const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    first_name: String,
    last_name: String,
    username: {type: String, required : true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    day_of_birth: Date,
    phone_number: String,
    avatar: String,
    gender: String
});

let Users = mongoose.model("Users", userSchema);

module.exports = Users;


