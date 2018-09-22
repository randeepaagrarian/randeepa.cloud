const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const Visit = require('../../models/visit/visit')

router.use(Auth.signedIn, Auth.validVisitUser, function(req, res, next) {
    next()
})

router.get('/fieldvisit/today', function(req, res) {
    async.series([
        function(callback) {
            Visit.fieldVisitsByDate(MDate.getDate('-'), callback)
        }
    ], function(err, data) {
        res.render('visit/visit/fieldvisit/today', {
            title: 'Field Visits Today',
            navbar: 'Visits',
            user: req.user,
            fieldVisits: data[0]
        })
    })
})

router.get('/fieldvisit/bydate', function(req, res) {
    async.series([
        function(callback) {
            Visit.fieldVisitsByDate(req.query.date, callback)
        }
    ], function(err, data) {
        res.render('visit/visit/fieldvisit/bydate', {
            title: 'Field Visits By Date',
            date: req.query.date,
            navbar: 'Visits',
            user: req.user,
            fieldVisits: data[0]
        })
    })
})

router.get('/fieldvisit/all', function(req, res) {
    async.series([
        function(callback) {
            Visit.fieldVisits(callback)
        }
    ], function(err, data) {
        res.render('visit/visit/fieldvisit/all', {
            title: 'All Field Visits',
            navbar: 'Visits',
            user: req.user,
            fieldVisits: data[0]
        })
    })
})

router.get('/fieldvisit/officer/bydate', function(req, res) {
    async.series([
        function(callback) {
            Visit.fieldVisitsByDateOfficer(req.query.date, req.query.officer, callback)
        }
    ], function(err, data) {
        res.render('visit/visit/fieldvisit/officer/bydate', {
            title: 'Field Visits By Date Officer',
            navbar: 'Visits',
            user: req.user,
            fieldVisits: data[0],
            officer: req.query.officer,
            date: req.query.date
        })
    })
})

router.get('/fieldvisit/inquiries/:id', function(req, res) {
    async.series([
        function(callback) {
            Visit.fieldVisitInquiries(req.params.id, callback)
        }
    ], function(err, data) {
        res.render('visit/visit/fieldvisit/inquiries', {
            title: 'Field Visit Inquiries',
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
            Visit.organizationalVisitsByDate(MDate.getDate('-'), callback)
        }
    ], function(err, data) {
        res.render('visit/visit/organizationalvisit/today', {
            title: 'Organizational Visits Today',
            navbar: 'Visits',
            user: req.user,
            organizationalVisits: data[0]
        })
    })
})

router.get('/organizationalvisit/bydate', function(req, res) {
    async.series([
        function(callback) {
            Visit.organizationalVisitsByDate(req.query.date, callback)
        }
    ], function(err, data) {
        res.render('visit/visit/organizationalvisit/bydate', {
            title: 'Organizational Visits By Date',
            date: req.query.date,
            navbar: 'Visits',
            user: req.user,
            organizationalVisits: data[0]
        })
    })
})

router.get('/organizationalvisit/all', function(req, res) {

    const pageNumber = req.query.page

    if(isNaN(pageNumber) || pageNumber == 0) {
        res.status(200).send('URL error')
        return
    }

    let prev, next

    if(pageNumber == 1) {
        prev = -1
        next = 2
    } else {
        prev = pageNumber - 1
        next = eval(pageNumber) + 1
    }

    async.series([
        function(callback) {
            Visit.organizationalVisits(pageNumber, callback)
        }
    ], function(err, data) {
        res.render('visit/visit/organizationalvisit/all', {
            title: 'All Organizational Visits',
            navbar: 'Visits',
            user: req.user,
            prev: prev,
            next: next,
            organizationalVisits: data[0]
        })
    })
})

router.get('/organizationalvisit/stocks/:id', function(req, res) {
    async.series([
        function(callback) {
            Visit.organizationalVisitStocks(req.params.id, callback)
        }
    ], function(err, data) {
        res.render('visit/visit/organizationalvisit/stocks', {
            title: 'Organizational Visit Stocks',
            navbar: 'Visits',
            user: req.user,
            stocks: data[0],
            organizationalVisitId: req.params.id
        })
    })
})

router.get('/organizationalvisit/officer/bydate', function(req, res) {
    async.series([
        function(callback) {
            Visit.organizationalVisitsByDateOfficer(req.query.date, req.query.officer, callback)
        }
    ], function(err, data) {
        res.render('visit/visit/organizationalvisit/officer/bydate', {
            title: 'Organizational Visits By Date Officer',
            navbar: 'Visits',
            user: req.user,
            organizationalVisits: data[0],
            officer: req.query.officer,
            date: req.query.date
        })
    })
})

module.exports = router
