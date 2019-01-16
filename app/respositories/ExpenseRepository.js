const Expense = require('../models/Expense');
const ValidationError = require('../commons/errors/ValidationError');
const mongoose = require('mongoose');

class ExpenseRepository {
    constructor() {
        this.expense = Expense;
    }

    async getAllExpense(uuid_user) {
        return await this.expense.aggregate([
            {
                $group: {
                    _id: {$substr: ["$date", 0, 10]},
                    expense: { $push: "$$ROOT" }
                }
            },
            {
                $sort: {'_id': -1}
            }
        ]);
    }

    async create(body) {
        if (body) {
            let expenseRequest = new Expense({
                expense_id: body.expense_id,
                type: body.type,
                category: body.category,
                type_category: body.type_category,
                cost: body.cost,
                date: body.date,
                date_short: body.date_short,
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
                date: body.date,
                date_short: body.date_short,
                category: body.category,
                type_category: body.type_category,
                cost: body.cost,
                updated_at: new Date(),
                description: body.description
            };

            let expenseServer = await this.expense.findOne({expense_id: body.expense_id});

            if(expenseServer) {
                expenseUpdate = JSON.parse(JSON.stringify(expenseUpdate));

                try {
                    let data = await this.expense.findByIdAndUpdate({_id: expenseServer._id},
                        {
                            $set: expenseUpdate
                        },
                        {
                            new: true
                        },
                        (err, model) => {
                            if(err) console.log('error update', err);

                            console.log('model', model);

                            cb(model);
                        }
                    );
                } catch (e) {
                    throw e;
                }
            }else{
                console.log('Not found expense');
            }
        }
    }
}

module.exports = new ExpenseRepository();