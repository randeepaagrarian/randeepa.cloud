const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const BankingAreaProfile = require('../../models/banking/areaprofile')

router.use(Auth.signedIn, Auth.validBankingAreaProfileUser, function(req, res, next) {
    next()
})

router.get('/today', function(req, res) {
    async.series([
        function(callback) {
            BankingAreaProfile.today(req.user.region, MDate.getDate('-'), callback)
        }
    ], function(err, details) {
        res.render('banking/areaprofile/today', {
            navbar: 'Banking',
            title: 'Area Today Bankings',
            bankings: details[0],
            results: details[0].length,
            user: req.user
        })
    })
})

router.get('/all', function(req, res) {
    async.series([
        function(callback) {
            BankingAreaProfile.all(req.user.region, callback)
        }
    ], function(err, details) {
        res.render('banking/areaprofile/all', {
            navbar: 'Banking',
            title: 'Area All Bankings',
            bankings: details[0],
            results: details[0].length,
            user: req.user
        })
    })
})

router.get('/search', function(req, res) {
    res.send('Area Profile Search')
})

module.exports = router
