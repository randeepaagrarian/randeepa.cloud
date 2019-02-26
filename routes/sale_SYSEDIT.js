const express = require('express')
const async = require('async')

const router = express.Router()

const Auth = require('../functions/auth')
const Stock = require('../models/stock/stock')

const sys_EDIT = require('../models/sys_EDIT/sale_SYSEDIT')

router.use(Auth.signedIn, function(req, res, next) {
  if(req.user.username == 'anushi.kc' || req.user.username == 'samantha' || req.user.username == 'shamal' || req.user.username == 'chula') {
    next()
  } else {
    res.redirect('/')
  }
})

router.get('/', function(req, res) {

  let pageNumber = req.query.page

  if(isNaN(pageNumber) || pageNumber == 0) {
      pageNumber = 1
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
      sys_EDIT.getAllSales(pageNumber, callback)
    }, function(callback) {
      Stock.getDealersAndShowrooms(callback)
    }
  ], function(err, data) {
    res.render('sale_SYSEDIT/sale_SYSEDIT', {
      user: req.user,
      dealersAndShowrooms: data[1],
      pageNo: pageNumber,
      prev: prev,
      next: next,
      sales: data[0]
    })
  })
})

router.get('/edit', function(req, res) {
  async.series([
    function(callback) {
      sys_EDIT.update(req.query.saleID, req.query.dealerID, callback)
    }
  ], function(err, data) {
    if(data[0] == true) {
      res.send("<font color='green'>Updated</font>")
    } else {
      res.send("<font color='green'>Something went wrong</font>")
    }
  })
})

module.exports = router
