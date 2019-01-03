const mongoose  = require('mongoose');

let Schema = mongoose.Schema;

let expenseSchema = new Schema({
    name: String,
    type: {type: String, required: true},
    category: {type: String, required: true},
    category_desc: String,
    cost: {type: Number, required: true},
    created_at: Date,
    updated_at: Date,
    description: String,
    uuid_user: {type: String, required: true}
});

let Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;