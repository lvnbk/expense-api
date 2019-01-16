const ExpenseRepository = require('../respositories/ExpenseRepository');

class ExpenseController {
    constructor() {
        this.expense = ExpenseRepository;
    }

    async getAllExpense(uuid_user) {
        return ExpenseRepository.getAllExpense(uuid_user);
    }

    async createExpense(data) {
        return await this.expense.create(data);
    }

    async updateExpense(data) {
        let result = {};
        await this.expense.update(data, (model) => {
            result = model;
        });

        console.log('updateExpense', result);

        return result;
    }
}

module.exports = new ExpenseController();