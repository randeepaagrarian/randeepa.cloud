const express = require('express')
const async = require('async')
const multiparty = require('connect-multiparty')
const Cloudinary = require('../../models/comms/cloudinary')

const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const HirePurchase = require('../../models/hirePurchase/hirePurchase')
const Stock = require('../../models/stock/stock')

const multipart = multiparty()

router.use(Auth.signedIn, Auth.validHirePurchaseUser, function(req, res, next) {
    next()
})

router.get('/new', function(req, res) {
    async.series([
        function(callback) {
            Stock.getModels(callback)
        }
    ], function(err, data) {
        res.render('hirePurchase/new', {
            title: 'New Contract',
            navbar: 'Hire Purchase',
            models: data[0],
            user: req.user
        })
    })
})

router.post('/new', function(req, res) {

    if(req.body.contractID1 == '' || req.body.customerName == '' || req.body.customerAddress == '' || req.body.customerContact == '') {
        res.send("<br><div class='alert alert-warning'>Please enter required fields</div>")
        return
    }

    const contract = {
        id_1: req.body.contractID1,
        id_2: req.body.contractID2,
        model_id: req.body.model,
        customer_name: req.body.customerName,
        customer_address: req.body.customerAddress,
        customer_contact: req.body.customerContact,
        guarantor1_name: req.body.guarantor1Name,
        guarantor1_address: req.body.guarantor1Address,
        guarantor1_contact: req.body.guarantor1Contact,
        guarantor2_name: req.body.guarantor2Name,
        guarantor2_address: req.body.guarantor2Address,
        guarantor2_contact: req.body.guarantor2Contact
    }

    const amounts = req.body.amount
    const dueDates = req.body.dueDate

    let installments = []

    if(amounts.constructor === Array) {
        for(let i = 0; i < amounts.length; i++) {
            installments.push([amounts[i], dueDates[i]])
        }
    } else {
        installments.push([amounts, dueDates])
    }

    async.series([
        function(callback) {
            HirePurchase.newContract(contract, installments, callback)
        }
    ], function(err, data) {
        if(err) {
            res.send("<br><div class='alert alert-warning'>" + err + "</div>")
        } else {
            res.send("<br><div class='alert alert-info'>Contract created successfully</div>")
        }
    })

})

router.get('/contracts', function(req, res) {
    async.series([
        function(callback) {
            HirePurchase.allContracts(callback)
        }
    ], function(err, data) {
        res.render('hirePurchase/contracts', {
            title: 'All Contracts',
            navbar: 'Hire Purchase',
            contracts: data[0],
            results: data[0].length,
            user: req.user
        })
    })
})

router.get('/contractInfo', function(req, res) {
    async.series([
        function(callback) {
            HirePurchase.installments(req.query.contractID, callback)
        }
    ], function(err, data) {
        res.render('hirePurchase/contractInfo', {
            title: 'Contract Installments',
            navbar: 'Hire Purchase',
            installments: data[0],
            user: req.user
        })
    })
})

module.exports = router
