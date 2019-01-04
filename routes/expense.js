const express = require('express');
const router = express.Router();
const ExpenseController = require('../app/controllers/ExpenseController');

router.get('/', async function(req, res, next) {
    try{
        let expense = await ExpenseController.getAllExpense(req.query.uuid_user);
        console.log('expense get', expense);
        res.json({
            code: 0,
            data: expense
        })
    }catch (e) {
        res.json({})

    }
});

router.post('/create', async function (req, res, next) {
    try {
        const expense = await ExpenseController.createExpense(req.body);

        console.log('expense create', expense);

        res.json({
            code: 0,
            data: expense
        });
    } catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
});

router.put('/update', async function(req, res, next) {
    try{
        const expense = await ExpenseController.updateExpense(req.body);

        res.json({
            code: 0,
            data: expense
        });
    }catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
});

module.exports = router;