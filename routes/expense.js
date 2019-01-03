const express = require('express');
const router = express.Router();
const ExpenseController = require('../app/controllers/ExpenseController');

router.post('/create', async function (req, res, next) {
    try {
        const expense = await ExpenseController.createExpense(req.body);

        res.json(expense);
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

        res.json(expense);
    }catch (error) {
        res.json({
            error: true,
            message: error.message
        })
    }
});

module.exports = router;