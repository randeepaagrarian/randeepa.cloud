const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const VisitMyProfile = require('../../models/visit/myprofile')

router.use(Auth.signedIn, Auth.validVisitMyProfileUser, function(req, res, next) {
    next()
})

router.get('/fieldvisit/all', function(req, res) {
    async.series([
        function(callback) {
            VisitMyProfile.fieldVisits(req.user.username, callback)
        }
    ], function(err, data) {
        res.render('visit/myprofile/fieldvisit/all', {
            title: 'My All Field Visits',
            navbar: 'Visits',
            user: req.user,
            fieldVisits: data[0]
        })
    })
})

router.get('/fieldvisit/today', function(req, res) {
    async.series([
        function(callback) {
            VisitMyProfile.fieldVisitsByDate(MDate.getDate('-'), req.user.username, callback)
        }
    ], function(err, data) {
        res.render('visit/myprofile/fieldvisit/today', {
            title: 'My Field Visits Today',
            navbar: 'Visits',
            user: req.user,
            fieldVisits: data[0]
        })
    })
})

router.get('/fieldvisit/inquiries/:id', function(req, res) {
    async.series([
        function(callback) {
            VisitMyProfile.fieldVisitInquiries(req.params.id, req.user.username, callback)
        }
    ], function(err, data) {
        res.render('visit/myprofile/fieldvisit/inquiries', {
            title: 'My Field Visit Inquiries',
            navbar: 'Visits',
            user: req.user,
            inquiries: data[0],
            fieldVisitId: req.params.id
        })
    })
})

router.get('/organizationalvisit/today', function(req, res) {
    async.series([
        function(callback) {
            VisitMyProfile.organizationalVisitsByDate(MDate.getDate('-'), req.user.username, callback)
        }
    ], function(err, data) {
        res.render('visit/myprofile/organizationalvisit/today', {
            title: 'My Organizational Visits Today',
            navbar: 'Visits',
            user: req.user,
            organizationalVisits: data[0]
        })
    })
})

router.get('/organizationalvisit/stocks/:id', function(req, res) {
    async.series([
        function(callback) {
            VisitMyProfile.organizationalVisitStocks(req.params.id, req.user.username, callback)
        }
    ], function(err, data) {
        res.render('visit/myprofile/organizationalvisit/stocks', {
            title: 'Organizational Visit Stocks',
            navbar: 'Visits',
            user: req.user,
            stocks: data[0],
            organizationalVisitId: req.params.id
        })
    })
})

router.get('/organizationalvisit/all', function(req, res) {
    async.series([
        function(callback) {
            VisitMyProfile.organizationalVisits(req.user.username, callback)
        }
    ], function(err, data) {
        res.render('visit/myprofile/organizationalvisit/all', {
            title: 'My All Organizational Visits',
            navbar: 'Visits',
            user: req.user,
            organizationalVisits: data[0]
        })
    })
})

module.exports = router
