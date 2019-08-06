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
        date: MDate.getDateTime(),
        user: req.user.username,
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
        }, function(callback) {
            HirePurchase.receipts(req.query.contractID, callback)
        }
    ], function(err, data) {
        res.render('hirePurchase/contractInfo', {
            title: 'Contract Installments',
            navbar: 'Hire Purchase',
            installments: data[0],
            receipts: data[1],
            user: req.user
        })
    })
})

router.get('/addPayment', function(req, res) {
    res.render('hirePurchase/addPayment', {
        title: 'Add Payment',
        navbar: 'Hire Purchase',
        user: req.user,
        installmentID: req.query.installmentID
    })
})

router.post('/addPayment/:installmentID', multipart, function(req, res) {
    const { contract_receipt_id, amount } = req.body
    const installmentID = req.params.installmentID

    if(isNaN(amount) || amount == '' || amount == undefined || contract_receipt_id == '') {
        req.flash('warning_msg', 'Data validation errors')
        res.redirect('/hirePurchase/addPayment?installmentID=' + req.params.installmentID)
        return
    }
    
    async.series([
        function(callback) {
            HirePurchase.validPaymentAmount(installmentID, amount, callback)
        }, function(callback) {
            HirePurchase.validReceiptAllocation(contract_receipt_id, amount, callback)
        }
    ], function(err, data) {
        if(!data[0]) {
            req.flash('warning_msg', 'Payment amount exceeds installment amount.')
            res.redirect('/hirePurchase/addPayment?installmentID=' + req.params.installmentID)
            return
        }

        if(!data[1]) {
            req.flash('warning_msg', 'Payment amount exceeds receipt amount.')
            res.redirect('/hirePurchase/addPayment?installmentID=' + req.params.installmentID)
            return
        }

        const payment = {
            contract_installment_id: installmentID,
            contract_receipt_id,
            amount,
            issued_user: req.user.username,
            issued_on: MDate.getDateTime()
        }

        async.series([
            function(callback) {
                HirePurchase.addPayment(payment, callback)
            }
        ], function(err, data) {
            if(!data[0]) {
                req.flash('warning_msg', 'Error occurred: ' + err.code)
                res.redirect('/hirePurchase/addPayment?installmentID=' + req.params.installmentID)
                return
            } else {
                req.flash('warning_msg', 'Payment added successfully.')
                res.redirect('/hirePurchase/addPayment?installmentID=' + req.params.installmentID)
                return
            }
        })

    })
    
})

router.get('/viewPayments', function(req, res) {
    async.series([
        function(callback) {
            HirePurchase.getPayments(req.query.installmentID, callback)
        }
    ], function(err, data) {
        res.render('hirePurchase/viewPayments', {
            title: 'Payments',
            navbar: 'Hire Purchase',
            user: req.user,
            installmentID: req.query.installmentID,
            payments: data[0]
        })
    })
})

router.get('/newReceipt', function(req, res) {
    res.render('hirePurchase/newReceipt', {
        title: 'New Receipt',
        navbar: 'Hire Purchase',
        user: req.user
    })
})

router.post('/newReceipt', multipart, function(req, res) {
    const { date, contract_id, amount, tr_number, tr_book_number } = req.body

    if(date == '' || contract_id == '' || amount == '' || isNaN(amount)) {
        req.flash('warning_msg', 'Data validation errors')
        res.redirect('/hirePurchase/newReceipt')
        return
    }

    const receipt = {
        date,
        contract_id,
        amount,
        tr_number,
        tr_book_number,
        issued_user: req.user.username,
        issued_on: MDate.getDateTime()
    }

    async.series([
        function(callback) {
            HirePurchase.addReceipt(receipt, callback)
        }
    ], function(err, data) {
        if(!data[0]) {
            req.flash('warning_msg', 'Error occured: ' + err.code)
            res.redirect('/hirePurchase/newReceipt')
            return
        } else {
            req.flash('warning_msg', 'Receipt generated')
            res.redirect('/hirePurchase/newReceipt')
            return
        }
    })
})

router.get('/printReceipt', function(req, res) {
    const receiptID = req.query.receiptID

    async.series([
        function(callback) {
            HirePurchase.receiptDetails(receiptID, callback)
        }
    ], function(err, data) {
        res.render('hirePurchase/printReceipt', {
            title: 'Receipt',
            receiptID,
            receiptData: data[0][0]
        })
    })
})

module.exports = router
