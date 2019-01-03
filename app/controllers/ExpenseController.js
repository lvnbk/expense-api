const Expense = require('../respositories/ExpenseRepository');

class ExpenseController {
    constructor() {
        this.expense = Expense;
    }

    async createExpense(data) {
        const expense = await this.expense.create(data);

        return expense;
    }

    async updateExpense(data) {
        let result = {};
        await this.expense.update(data, (model) => {
            result = model;
        });

        return result;
    }
}

module.exports = new ExpenseController();