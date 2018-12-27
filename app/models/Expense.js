const mongoose  = require('mongoose');

let Schema = mongoose.Schema;

let expenseSchema = new Schema({
    name: String,
    type: String,
    category: String,
    category_desc: String,
    cost: Number,
    created_at: Date,
    updated_at: Date,
    description: String,
    uuid_user: String
});

let Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;