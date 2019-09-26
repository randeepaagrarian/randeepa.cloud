const express = require('express')
const async = require('async')
const multiparty = require('connect-multiparty')
const Cloudinary = require('../../models/comms/cloudinary')

const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const HirePurchase = require('../../models/hirePurchase/hirePurchase')
const Stock = require('../../models/stock/stock')
const User = require('../../models/user/user')

const multipart = multiparty()

router.use(Auth.signedIn, Auth.validHirePurchaseUser, function(req, res, next) {
    next()
})

router.get('/new', function(req, res) {
    async.series([
        function(callback) {
            Stock.getModels(callback)
        }, function(callback) {
            HirePurchase.getRecoveryOfficers(callback)
        }, function(callback) {
            HirePurchase.getBatches(callback)
        }
    ], function(err, data) {
        res.render('hirePurchase/new', {
            title: 'New Contract',
            navbar: 'Hire Purchase',
            models: data[0],
            recoveryOfficers: data[1],
            batches: data[2],
            user: req.user
        })
    })
})

router.post('/new', function(req, res) {

    if(req.body.contractID1 == '' || req.body.customerName == '' || req.body.customerAddress == '' || req.body.customerContact == '') {
        res.send("<br><div class='alert alert-warning'>Please enter required fields</div>")
        return
    }

    let sale_id = req.body.cloudID
    if(sale_id == '') { sale_id = null }

    const contract = {
        date: MDate.getDateTime(),
        user: req.user.username,
        id_1: req.body.contractID1,
        id_2: req.body.contractID2,
        model_id: req.body.model,
        contract_batch_id: req.body.contractBatch,
        recovery_officer: req.body.recoveryOfficer,
        sale_id,
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
            url: req.url,
            results: data[0].length,
            user: req.user
        })
    })
})

router.get('/excel/contracts', function(req, res) {
    async.series([
        function(callback) {
            HirePurchase.allContracts(callback)
        }
    ], function(err, data) {
        res.xls('All Contracts.xlsx', data[0])
    })
})

router.get('/contractInfo', function(req, res) {
    async.series([
        function(callback) {
            HirePurchase.installments(req.query.contractID, callback)
        }, function(callback) {
            HirePurchase.receipts(req.query.contractID, callback)
        }, function(callback) {
            HirePurchase.getContractInfo(req.query.contractID, callback)
        }, function(callback) {
            HirePurchase.getComments(req.query.contractID, callback)
        }
    ], function(err, data) {
        res.render('hirePurchase/contractInfo', {
            title: 'Contract Details',
            navbar: 'Hire Purchase',
            contractID: req.query.contractID,
            installments: data[0],
            receipts: data[1],
            user: req.user,
            contractInfo: data[2],
            comments: data[3]
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

router.get('/contractsByBatch', function(req, res) {
    const batchID = req.query.batch;

    async.series([
        function(callback) {
            HirePurchase.allContractsByBatch(batchID, callback)
        }
    ], function(err, data) {
        res.render('hirePurchase/contracts', {
            title: 'Contracts by Batch',
            navbar: 'Hire Purchase',
            contracts: data[0],
            url: req.url,
            results: data[0].length,
            user: req.user
        })
    })
})

router.get('/excel/contractsByBatch', function(req, res) {
    const batchID = req.query.batch;

    async.series([
        function(callback) {
            HirePurchase.allContractsByBatch(batchID, callback)
        }
    ], function(err, data) {
        res.xls('Contracts By Batch.xlsx', data[0])
    })
})

router.get('/contractsAsAt', function(req, res) {
    const date = req.query.date
    const batch = req.query.batch

    if(batch == -1) {
        const title = 'All Contracts As At ' + date

        async.series([
            function(callback) {
                HirePurchase.allContractsAsAt(date, callback)
            }
        ], function(err, data) {
            res.render('hirePurchase/contracts', {
                title,
                navbar: 'Hire Purchase',
                contracts: data[0],
                url: req.url,
                results: data[0].length,
                user: req.user
            })
        })
    } else {
        const title = 'Contracts As At ' + date

        async.series([
            function(callback) {
                HirePurchase.allContractsAsAtByBatch(date, batch, callback)
            }
        ], function(err, data) {
            res.render('hirePurchase/contracts', {
                title,
                navbar: 'Hire Purchase',
                contracts: data[0],
                url: req.url,
                results: data[0].length,
                user: req.user
            })
        })
    }
})

router.get('/excel/contractsAsAt', function(req, res) {
    const date = req.query.date
    const batch = req.query.batch

    if(batch == -1) {
        const title = 'All Contracts As At ' + date

        async.series([
            function(callback) {
                HirePurchase.allContractsAsAt(date, callback)
            }
        ], function(err, data) {
            res.xls(title + '.xlsx', data[0])
        })
    } else {
        const title = 'Contracts As At ' + date

        async.series([
            function(callback) {
                HirePurchase.allContractsAsAtByBatch(date, batch, callback)
            }
        ], function(err, data) {
            res.xls(title + '.xlsx', data[0])
        })
    }
})

router.get('/changeInstallment', function(req, res) {
    const installmentID = req.query.installmentID
    const contractID = req.query.contractID

    async.series([
        function(callback) {
            HirePurchase.editLocked(installmentID, callback)
        }
    ], function(err, data) {
        if(data[0] == false) {
            async.series([
                function(callback) {
                    HirePurchase.getInstallmentDetails(installmentID, callback)
                }
            ], function(err, data) {
                res.render('hirePurchase/changeInstallment', {
                    title: 'Change Installment',
                    navbar: 'Hire Purchase',
                    installmentID,
                    contractID,
                    installmentDetails: data[0],
                    user: req.user
                })
            })
        } else {
            res.redirect('/hirePurchase')
            return
        }
    })
})

router.post('/changeInstallment', multipart, function(req, res) {

    if(req.body.reason == '') {
        req.flash('warning_msg', 'Please enter the reason for change');
        res.redirect('/hirePurchase/changeInstallment?installmentID=' + req.query.installmentID + '&contractID=' + req.query.contractID)
        return
    }

    const installmentID = req.query.installmentID

    const installmentChange = {
        amount: req.body.amount,
        due_date: req.body.due_date
    }
    
    async.series([
        function(callback) {
            HirePurchase.changeInstallment(installmentID, installmentChange, MDate.getDateTime(), req.user.username, req.body.reason, callback)
        }
    ], function(err, data) {
        if(data[0]) {
            req.flash('warning_msg', 'Installment udpated');
            res.redirect('/hirePurchase/contractInfo?contractID=' + req.query.contractID)
            return
        } else {
            req.flash('warning_msg', 'Validation errors ' + err.code);
            res.redirect('/hirePurchase/changeInstallment?installmentID=' + req.query.installmentID)
            return
        }
    })

})

router.get('/edit', function(req, res) {
    const { contractID } = req.query

    async.series([
        function(callback) {
            HirePurchase.contractEditLocked(contractID, callback)
        }
    ], function(err, data) {
        if(data[0] == false) {
            async.series([
                function(callback) {
                    HirePurchase.rawInfo(contractID, callback)
                }, function(callback) {
                    User.getAllUsers(callback)
                }, function(callback) {
                    Stock.getModels(callback)
                }, function(callback) {
                    HirePurchase.getBatches(callback)
                }
            ], function(err, data) {
                res.render('hirePurchase/edit', {
                    title: 'Edit Contract',
                    navbar: 'Hire Purchase',
                    contractID,
                    user: req.user,
                    contract: data[0][0],
                    users: data[1],
                    models: data[2],
                    batches: data[3]
                })
            })
        } else {
            req.flash('warning_msg', 'Edit Lock enabled')
            res.redirect('/hirePurchase/contractInfo?contractID=' + contractID)
        }
    })
})

router.post('/edit/:contractID', function(req, res) {
    const { contractID } = req.params
    let newContract = {}

    for(let key in req.body) {
        newContract[key] = decodeURIComponent(req.body[key])
    }

    delete newContract.id
    delete newContract.date
    delete newContract.user

    for(let key in newContract) {
        if(newContract[key] == '') {
            delete newContract[key]
        }
    }

    async.series([
        function(callback) {
            HirePurchase.edit(contractID, newContract, req.user.username, MDate.getDateTime(), callback)
        }
    ], function(err, data) {
        if(data[0]) {
            req.flash('success_msg', 'Contract successfully edited');
            res.redirect('/hirePurchase/edit?contractID=' + contractID)
            return
        } else {
            req.flash('error', 'Error occurred ' + err.code);
            res.redirect('/hirePurchase/edit?contractID=' + contractID)
            return
        }
    })
})

router.get('/pendingInstallments', function(req, res) {
    const title = 'Pending Installments As At ' + req.query.date
    if(req.query.filter == -1) {
        async.series([
            function(callback) {
                HirePurchase.pendingInstallments(req.query.date, callback)
            }
        ], function(err, data) {
            res.render('hirePurchase/pendingInstallments', {
                title,
                navbar: 'Hire Purchase',
                installments: data[0],
                url: req.url,
                results: data[0].length,
                user: req.user
            })
        })
    } else if(req.query.filter == 1) {
        async.series([
            function(callback) {
                HirePurchase.pendingInstallmentsArrears(req.query.date, callback)
            }
        ], function(err, data) {
            res.render('hirePurchase/pendingInstallments', {
                title,
                navbar: 'Hire Purchase',
                installments: data[0],
                url: req.url,
                results: data[0].length,
                user: req.user
            })
        })
    } else if(req.query.filter == 2) {
        async.series([
            function(callback) {
                HirePurchase.pendingInstallmentsUpcoming(req.query.date, callback)
            }
        ], function(err, data) {
            res.render('hirePurchase/pendingInstallments', {
                title,
                navbar: 'Hire Purchase',
                installments: data[0],
                url: req.url,
                results: data[0].length,
                user: req.user
            })
        })
    } else {
        res.send('Error')
    }
})

router.get('/excel/pendingInstallments', function(req, res) {
    const title = 'Pending Installments As At ' + req.query.date
    if(req.query.filter == -1) {
        async.series([
            function(callback) {
                HirePurchase.pendingInstallments(req.query.date, callback)
            }
        ], function(err, data) {
            res.xls(title + '.xlsx', data[0])
        })
    } else if(req.query.filter == 1) {
        async.series([
            function(callback) {
                HirePurchase.pendingInstallmentsArrears(req.query.date, callback)
            }
        ], function(err, data) {
            res.xls(title + '.xlsx', data[0])
        })
    } else if(req.query.filter == 2) {
        async.series([
            function(callback) {
                HirePurchase.pendingInstallmentsUpcoming(req.query.date, callback)
            }
        ], function(err, data) {
            res.xls(title + '.xlsx', data[0])
        })
    } else {
        res.send('Error')
    }
})

router.post('/addComment/:contractID', multipart, (req, res) => {
    const { contractID } = req.params;
    const { comment, installment, commitment, due_date } = req.body;
    if(comment == '') {
        req.flash('warning_msg', 'Please enter a comment');
        res.redirect('/hirePurchase/contractInfo?contractID=' + contractID)
        return
    }
    const contractComment = {
        contract_id: contractID,
        installment_id: installment == -1 ? null : installment,
        username: req.user.username,
        date: MDate.getDateTime(),
        text: comment,
        commitment,
        due_date: commitment == 1 ? due_date : null
    }
    async.series([
        function(callback) {
            HirePurchase.addComment(contractComment, callback)
        }
    ], function(err, added) {
        if(added) {
            res.redirect('/hirePurchase/contractInfo?contractID=' + contractID)
            return
        } else {
            req.flash('warning_msg', 'Failed to add comment ' + err.code);
            res.redirect('/hirePurchase/contractInfo?contractID=' + contractID)
            return
        }
    })
})

router.get('/fulfill/:contractID/:commentID/:type', (req, res) => {

    const fulfillType = {
        fulfilled: 1,
        fulfilled_type: req.params.type
    }

    async.series([
        function(callback) {
          HirePurchase.fulfill(fulfillType, req.params.commentID, req.user.username, callback)
        }
      ], function(err, fulfilled) {
        if(fulfilled) {
            res.redirect('/hirePurchase/contractInfo?contractID=' + req.params.contractID)
            return
        } else {
            req.flash('warning_msg', 'Failed to fulfill commitment ' + err.code);
            res.redirect('/hirePurchase/contractInfo?contractID=' + req.params.contractID)
            return
        }
      })
})

module.exports = router
