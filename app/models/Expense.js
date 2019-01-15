const mongoose  = require('mongoose');

let Schema = mongoose.Schema;

let expenseSchema = new Schema({
    expense_id: {type: String, require: true},
    cost: {type: Number, required: true},
    type: {type: String, required: true},
    category: {type: String, required: true},
    type_category: Number,
    description: String,
    date: Date,
    date_short: Date,
    created_at: Date,
    updated_at: Date,
    del_flag: {type: Boolean, default: false},
    has_sent: {type: Boolean, default: false},
    uuid_user: {type: String, required: true}
});

let Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;