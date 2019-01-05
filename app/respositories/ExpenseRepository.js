const Expense = require('../models/Expense');
const ValidationError = require('../commons/errors/ValidationError');
const mongoose = require('mongoose');

class ExpenseRepository {
    constructor() {
        this.expense = Expense;
    }

    async getAllExpense(uuid_user) {
        return await this.expense.find({uuid_user, del_flag: false}).sort({created_at: -1}); // Asc sort.
    }

    async create(body) {
        if (body) {
            let expenseRequest = new Expense({
                expense_id: body.expense_id,
                type: body.type,
                category: body.category,
                category_desc: body.category_desc,
                cost: body.cost,
                created_at: new Date(),
                updated_at: new Date(),
                description: body.description,
                uuid_user: body.uuid_user
            });

            try {
                return await this.expense.create(expenseRequest);
            } catch (e) {
                console.log('e', e);
                throw e;
            }
        }
    }

    async update(body, cb) {
        if (body) {
            let expenseUpdate = {
                name: body.name,
                type: body.type,
                category: body.category,
                category_desc: body.category_desc,
                cost: body.cost,
                updated_at: new Date(),
                description: body.description
            };

            expenseUpdate = JSON.parse(JSON.stringify(expenseUpdate));

            try {
                let data = await this.expense.findByIdAndUpdate({_id: '5c2ddaa34c4e7d1aca287340'},
                    {
                        $set: expenseUpdate
                    },
                    {
                        new: true
                    },
                    (err, model) => {
                        cb(model);
                    }
                );
            } catch (e) {
                throw e;
            }
        }
    }
}

module.exports = new ExpenseRepository();