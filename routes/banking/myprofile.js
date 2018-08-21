const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const BankingMyProfile = require('../../models/banking/myprofile')

router.use(Auth.signedIn, Auth.validBankingMyProfileUser, function(req, res, next) {
    next()
})

router.get('/today', function(req, res) {
    async.series([
        function(callback) {
            BankingMyProfile.today(req.user.username, MDate.getDate('-'), callback)
        }
    ], function(err, details) {
        res.render('banking/myprofile/today', {
            navbar: 'Banking',
            title: 'My Today Bankings',
            bankings: details[0],
            results: details[0].length,
            user: req.user
        })
    })
})

router.get('/all', function(req, res) {
    async.series([
        function(callback) {
            BankingMyProfile.all(req.user.username, callback)
        }
    ], function(err, details) {
        res.render('banking/myprofile/all', {
            navbar: 'Banking',
            title: 'My All Bankings',
            bankings: details[0],
            results: details[0].length,
            user: req.user
        })
    })
})

router.get('/search', function(req, res) {
    res.send('My Profile Search')
})

module.exports = router
