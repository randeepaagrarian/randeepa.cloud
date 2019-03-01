const express = require('express')
const async = require('async')

const router = express.Router()

const Admin = require('../../models/admin/admin')
const DealerProfile = require('../../models/dealerProfile/dealerProfile')
const Stock = require('../../models/stock/stock')

const MDate = require('../../functions/mdate')
const Auth = require('../../functions/auth')

const SalesFunctions = require('../../functions/sale')

router.use(Auth.signedIn, Auth.validDealerProfileUser, function(req, res, next) {
    next()
})

router.get('/overallPerformanceView', function(req, res) {
  async.series([
    function(callback) {
      DealerProfile.companyDealerPerformanceSummary(req.query.startDate, req.query.endDate, req.query.exclusive, callback)
    }
  ], function(err, data) {
    res.render('dealerProfile/overallPerformanceView', {
      url: req.url,
      navbar: 'Dealer Profile',
      user: req.user,
      title: 'Overall Dealer Performance View',
      start_date: req.query.startDate,
      end_date: req.query.endDate,
      performanceSummaries: data[0][0]
    })
  })
})

router.get('/excel/overallPerformanceView', function(req, res) {
    async.series([
        function(callback) {
            DealerProfile.companyDealerPerformanceSummary(req.query.startDate, req.query.endDate, req.query.exclusive, callback)
        }
    ], function(err, details) {
        res.xls('Company Dealer Performance Summary from ' + req.query.startDate + ' to ' + req.query.endDate + '.xlsx', details[0][0])
    })
})


router.get('/dealerProfileView', function(req, res) {
    async.series([
        function(callback) {
            DealerProfile.dealerPerformanceSummary(req.query.dealerID, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            Stock.getDealerDetails(req.query.dealerID, callback)
        }, function(callback) {
            DealerProfile.salesUnitDetails(req.query.dealerID, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            DealerProfile.dealerVisits(req.query.dealerID, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            DealerProfile.dealerStocks(req.query.dealerID, req.query.startDate, req.query.endDate, callback)
        }, function(callback) {
            DealerProfile.dealerInquiries(req.query.dealerID, req.query.startDate, req.query.endDate, callback)
        }
    ], function(err, data) {
        res.render('dealerProfile/dealerProfileView', {
            navbar: 'Dealer Profile',
            user: req.user,
            title: 'Dealer Profile',
            dealerPerformanceSummary: data[0],
            dealerDetails: data[1],
            salesUnitDetail: data[2],
            modelSummary: SalesFunctions.modelSummary(data[2]),
            dealerVisits: data[3],
            dealerStocks: data[4],
            dealerInquiries: data[5],
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        })
    })
})

module.exports = router
