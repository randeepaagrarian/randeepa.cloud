const express = require('express')
const bcrypt = require('bcryptjs')
const async = require('async')

const router = express.Router()

const Admin = require('../../models/admin/admin')
const AreaProfile = require('../../models/profile/areaprofile')

const MDate = require('../../functions/mdate')
const Auth = require('../../functions/auth')

const SalesFunctions = require('../../functions/sale')

router.use(Auth.signedIn, Auth.validProfileAreaUser, function(req, res, next) {
    next()
})

router.get('/overallPerformanceView', function(req, res) {
  async.series([
    function(callback) {
      AreaProfile.regionalOfficerPerformanceSummary(req.query.startDate, req.query.endDate, req.user.region, callback)
    }
  ], function(err, data) {
    res.render('profile/areaprofile/overallPerformanceView', {
      navbar: 'Profile',
      user: req.user,
      title: 'Overall Performance View',
      start_date: req.query.startDate,
      end_date: req.query.endDate,
      performanceSummaries: data[0][0]
    })
  })
})

router.get('/officerProfileView', function(req, res) {
    async.series([
        function(callback) {
            Admin.userDetailsByUsername(req.query.userId, callback)
        }, function(callback) {
            AreaProfile.officerPerformanceSummary(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            AreaProfile.salesUnitDetails(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            AreaProfile.dealerVisits(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            AreaProfile.bankings(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            AreaProfile.instituteVisits(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            AreaProfile.dealerStocks(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            AreaProfile.dealerInquiries(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            AreaProfile.fieldVisits(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            AreaProfile.fieldVisitInquiries(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }
    ], function(err, data) {
        res.render('profile/areaprofile/officerProfileView', {
            navbar: 'Profile',
            user: req.user,
            title: 'Profile',
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            userDetails: data[0],
            officerPerformanceSummary: data[1],
            salesUnitDetail: data[2],
            modelSummary: SalesFunctions.modelSummary(data[2]),
            dealerVisits: data[3],
            bankings: data[4],
            instituteVisits: data[5],
            dealerStocks: data[6],
            dealerInquiries: data[7],
            fieldVisits: data[8],
            fieldVisitInquiries: data[9]
        })
    })
})

module.exports = router
