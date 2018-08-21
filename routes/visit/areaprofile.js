const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const VisitAreaProfile = require('../../models/visit/areaprofile')

router.use(Auth.signedIn, Auth.validVisitAreaProfileUser, function(req, res, next) {
    next()
})

router.get('/fieldvisit/today', function(req, res) {
    async.series([
        function(callback) {
            VisitAreaProfile.fieldVisitsByDate(MDate.getDate('-'), req.user.region, callback)
        }
    ], function(err, data) {
        res.render('visit/areaprofile/fieldvisit/today', {
            title: 'Area Field Visits Today',
            navbar: 'Visits',
            user: req.user,
            fieldVisits: data[0]
        })
    })
})

router.get('/fieldvisit/all', function(req, res) {
    async.series([
        function(callback) {
            VisitAreaProfile.fieldVisits(req.user.region, callback)
        }
    ], function(err, data) {
        res.render('visit/areaprofile/fieldvisit/all', {
            title: 'Area All Field Visits',
            navbar: 'Visits',
            user: req.user,
            fieldVisits: data[0]
        })
    })
})

router.get('/fieldvisit/inquiries/:id', function(req, res) {
    async.series([
        function(callback) {
            VisitAreaProfile.fieldVisitInquiries(req.params.id, req.user.region, callback)
        }
    ], function(err, data) {
        res.render('visit/areaprofile/fieldvisit/inquiries', {
            title: 'Area Field Visit Inquiries',
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
            VisitAreaProfile.organizationalVisitsByDate(MDate.getDate('-'), req.user.region, callback)
        }
    ], function(err, data) {
        res.render('visit/areaprofile/organizationalvisit/today', {
            title: 'Area Organizational Visits Today',
            navbar: 'Visits',
            user: req.user,
            organizationalVisits: data[0]
        })
    })
})

router.get('/organizationalvisit/stocks/:id', function(req, res) {
    async.series([
        function(callback) {
            VisitAreaProfile.organizationalVisitStocks(req.params.id, req.user.region, callback)
        }
    ], function(err, data) {
        res.render('visit/areaprofile/organizationalvisit/stocks', {
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
            VisitAreaProfile.organizationalVisits(req.user.region, callback)
        }
    ], function(err, data) {
        res.render('visit/areaprofile/organizationalvisit/all', {
            title: 'Area All Organizational Visits',
            navbar: 'Visits',
            user: req.user,
            organizationalVisits: data[0]
        })
    })
})

module.exports = router
