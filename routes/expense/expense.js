const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const Expense = require('../../models/expense/expense')

router.use(Auth.signedIn, Auth.validExpenseUser, function(req, res, next) {
    next()
})

router.get('/all', function(req, res) {
    async.series([
        function(callback) {
            Expense.all(callback)
        }, function(callback) {
            Expense.monthlyTotal(callback)
        }
    ], function(err, details) {
        res.render('expense/expense/all', {
            navbar: 'Expense',
            title: 'All Expenses',
            user: req.user,
            expenses: details[0],
            monthlyTotal: details[1]
        })
    })
})

router.get('/expenseItems', function(req, res) {
    async.series([
        function(callback) {
            Expense.getItems(req.query.expenseId, callback)
        }
    ], function(err, details) {
        res.render('expense/expense/items', {
            navbar: 'Expense',
            title: 'Expense Items',
            user: req.user,
            expenseId: req.query.expenseId,
            url: encodeURIComponent(req.originalUrl),
            expenseItems: details[0]
        })
    })
})

router.get('/markBillReceived', function(req, res) {
    async.series([
        function(callback) {
            Expense.markBillReceived(req.query.expenseItemId, req.user.username, callback)
        }
    ], function(err, data) {
        if(err) {
            req.flash('warning_msg', 'Failed to mark bill received')
        	res.redirect(req.query.continue)
        } else {
            req.flash('success_msg', 'Bill successfully marked as received')
        	res.redirect(req.query.continue)
        }
    })
})

router.get('/markBillPaid', function(req, res) {
    async.series([
        function(callback) {
            Expense.markBillPaid(req.query.expenseItemId, req.user.username, callback)
        }
    ], function(err, data) {
        if(err) {
            req.flash('warning_msg', 'Failed to mark bill paid')
        	res.redirect(req.query.continue)
        } else {
            req.flash('success_msg', 'Bill successfully marked as paid')
        	res.redirect(req.query.continue)
        }
    })
})

router.get('/markBillRejected', function(req, res) {
    async.series([
        function(callback) {
            Expense.markBillRejected(req.query.expenseItemId, req.user.username, callback)
        }
    ], function(err, data) {
        if(err) {
            req.flash('warning_msg', 'Failed to mark bill rejected')
        	res.redirect(req.query.continue)
        } else {
            req.flash('success_msg', 'Bill successfully marked as rejected')
        	res.redirect(req.query.continue)
        }
    })
})

module.exports = router
