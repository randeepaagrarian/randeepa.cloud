const express = require('express')
const async = require('async')

const router = express.Router()

const Admin = require('../../models/admin/admin')
const Profile = require('../../models/profile/profile')

const MDate = require('../../functions/mdate')
const Auth = require('../../functions/auth')

const SalesFunctions = require('../../functions/sale')

router.use(Auth.signedIn, Auth.validProfileUser, function(req, res, next) {
    next()
})

router.get('/overallPerformanceView', function(req, res) {
  async.series([
    function(callback) {
      Profile.companyOfficerPerformanceSummary(req.query.startDate, req.query.endDate, callback)
    }
  ], function(err, data) {
    res.render('profile/overallPerformanceView', {
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
            Profile.officerPerformanceSummary(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            Profile.salesUnitDetails(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            Profile.dealerVisits(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            Profile.bankings(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            Profile.instituteVisits(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            Profile.dealerStocks(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            Profile.dealerInquiries(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            Profile.fieldVisits(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            Profile.fieldVisitInquiries(req.query.userId, req.query.startDate, req.query.endDate, callback)
        }
    ], function(err, data) {
        res.render('profile/officerProfileView', {
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
