const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')
const SalesFunctions = require('../../functions/sale')

const SaleMyProfile = require('../../models/sale/myprofile')

router.use(Auth.signedIn, Auth.validSaleMyProfileUser, function(req, res, next) {
    next()
})

router.get('/all', function(req, res) {
    async.series([
        function(callback) {
            SaleMyProfile.all(req.user.username, callback)
        }
    ], function(err, details) {
        res.render('sale/myprofile/all', {
            navbar: 'Sales',
            title: 'My All Sales',
            sales: details[0],
            results: details[0].length,
            modelSummary: SalesFunctions.modelSummary(details[0]),
            user: req.user
        })
    })
})

router.get('/today', function(req, res) {
    async.series([
        function(callback) {
            SaleMyProfile.today(req.user.username, MDate.getDate('-'), callback)
        }
    ], function(err, details) {
        res.render('sale/myprofile/today', {
            navbar: 'Sales',
            title: 'My Today Sales',
            sales: details[0],
            results: details[0].length,
            modelSummary: SalesFunctions.modelSummary(details[0]),
            user: req.user
        })
    })
})

module.exports = router
