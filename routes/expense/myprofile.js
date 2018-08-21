const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const ExpenseMyProfile = require('../../models/expense/myprofile')

router.use(Auth.signedIn, Auth.validExpenseMyProfileUser, function(req, res, next) {
    next()
})

router.get('/all', function(req, res) {
    async.series([
        function(callback) {
            ExpenseMyProfile.all(req.user.username, callback)
        }, function(callback) {
            ExpenseMyProfile.monthlyTotal(req.user.username, callback)
        }
    ], function(err, details) {
        res.render('expense/myprofile/all', {
            navbar: 'Expense',
            title: 'My All Expenses',
            user: req.user,
            expenses: details[0],
            monthlyTotal: details[1]
        })
    })
})

router.get('/expenseItems', function(req, res) {
    async.series([
        function(callback) {
            ExpenseMyProfile.getItems(req.query.expenseId, req.user.username, callback)
        }
    ], function(err, details) {
        res.render('expense/myprofile/items', {
            navbar: 'Expense',
            title: 'Expense Items',
            user: req.user,
            expenseId: req.query.expenseId,
            expenseItems: details[0]
        })
    })
})

module.exports = router
