const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const Banking = require('../../models/banking/banking')

router.use(Auth.signedIn, Auth.validBankingUser, function(req, res, next) {
    next()
})

router.get('/today', function(req, res) {
    async.series([
        function(callback) {
            Banking.today(MDate.getDate('-'), callback)
        }
    ], function(err, details) {
        res.render('banking/today', {
            title: 'Today Bankings',
            navbar: 'Banking',
            url: req.url,
            bankings: details[0],
            results: details[0].length,
            user: req.user
        })
    })
})

router.get('/excel/today', function(req, res) {
    async.series([
        function(callback) {
            Banking.today(MDate.getDate('-'), callback)
        }
    ], function(err, details) {
        res.xls('Today.xlsx', details[0])
    })
})

router.get('/all', function(req, res) {
    async.series([
        function(callback) {
            Banking.all(callback)
        }
    ], function(err, details) {
        res.render('banking/all', {
            title: 'All Bankings',
            navbar: 'Banking',
            url: req.url,
            bankings: details[0],
            results: details[0].length,
            user: req.user
        })
    })
})

router.get('/excel/all', function(req, res) {
    async.series([
        function(callback) {
            Banking.all(callback)
        }
    ], function(err, details) {
        res.xls('All.xlsx', details[0])
    })
})

router.get('/date', function(req, res) {
    async.series([
        function(callback) {
            Banking.today(req.query.date, callback)
        }
    ], function(err, details) {
        res.render('banking/by_date/all', {
            navbar: 'Banking',
            title: 'Banking By Date',
            url: req.url,
            date: req.query.date,
            bankings: details[0],
            results: details[0].length,
            user: req.user
        })
    })
})

router.get('/excel/date', function(req, res) {
    async.series([
        function(callback) {
            Banking.today(req.query.date, callback)
        }
    ], function(err, details) {
        res.xls(req.query.date + '.xlsx', details[0])
    })
})

router.get('/search', function(req, res) {
    res.send('Banking Search')
})

module.exports = router
