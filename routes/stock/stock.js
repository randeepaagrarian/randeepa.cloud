const express = require('express')
const async = require('async')

const router = express.Router()

const MDate = require('../../functions/mdate')
const Auth = require('../../functions/auth')

const Stock = require('../../models/stock/stock')
const Region = require('../../models/region/region')

router.use(Auth.signedIn, Auth.validStockUser, function(req, res, next) {
    next()
})

router.get('/packingList', function(req, res){
    async.series([
        function(callback) {
            Stock.getMainStocks(callback)
        }, function(callback) {
            Stock.getModels(callback)
        }, function(callback) {
            Stock.getImporters(callback)
        }
    ], function(err, data) {
        res.render('stock/stock/packingList', {
            title: 'New Packing List',
            navbar: 'Stock',
            user: req.user,
            mainStocks: data[0],
            models: data[1],
            importers: data[2]
        })
    })
})

router.post('/packingList', function(req, res) {

    async.series([
        function(callback) {
            Stock.validateImporter(req.body.fromStock, callback)
        }
    ], function(err, data) {
        if(data[0] == true) {

            const deliveryDocument = {
                delivery_document_type_id: 1,
                dealer_id: req.body.mainStock,
                from_dealer_id: req.body.fromStock,
                date: MDate.getDateTime(),
                issuer: req.user.username,
                notes: req.body.notes,
                officer_responsible: req.body.officerResponsible,
                officer_telephone: req.body.officerTelephone,
                vehicle_no: req.body.vehicleNo,
                driver_name: req.body.driverName,
                driver_nic: req.body.driverNic,
                driver_telephone: req.body.driverTelephone,
            }

            const models = req.body.model
            const primaryNumbers = req.body.primaryNumber
            const secondaryNumbers = req.body.secondaryNumber
            const prices = req.body.price

            let machines = []

            if(models.constructor === Array) {
                for(let i = 0; i < models.length; i++) {
                    machines.push([models[i], primaryNumbers[i], secondaryNumbers[i], prices[i]])
                }
            } else {
                machines.push([models, primaryNumbers, secondaryNumbers, prices])
            }

            async.series([
                function(callback) {
                    Stock.newPackingList(deliveryDocument, machines, callback)
                }
            ], function(err, data) {
                if(err) {
                    res.send("<br><div class='alert alert-warning'>" + err.code + "</div>")
                } else {
                    res.send("<br><div class='alert alert-info'>Packing list issued successfully</div>")
                }
            })

        } else {
            res.send("<br><div class='alert alert-warning'>Importer validation error</div>")
        }
    })

})

router.get('/deliveryNote', function(req, res){
    async.series([
        function(callback) {
            Stock.getMainStocks(callback)
        }, function(callback) {
            Stock.getDealersAndShowrooms(callback)
        }
    ], function(err, data) {
        res.render('stock/stock/deliveryNote', {
            title: 'New Delivery Note',
            navbar: 'Stock',
            user: req.user,
            mainStocks: data[0],
            dealersAndShowrooms: data[1]
        })
    })
})

router.post('/getSecondaryIdModelName', function(req, res) {

    async.series([
        function(callback) {
            Stock.getSecondaryIdModelName(req.body.primaryNumber, callback)
        }
    ], function(err, data) {

        let response = {"secondaryId": "Invalid", "modelName": "Invalid" }

        if(data[0][0] != undefined) {
            response.secondaryId = data[0][0].secondary_id
            response.modelName = data[0][0].name
        }

        res.send(JSON.stringify(response))
    })

})

router.post('/deliveryNote', function(req, res) {
    async.series([
        function(callback) {
            Stock.validateMainStock(req.body.mainStock, callback)
        }, function(callback) {
            Stock.validateShowroomOrDealer(req.body.dealerOrShowroom, callback)
        }
    ], function(err, data) {
        if(data[0] == true && data[1] == true) {

            const deliveryDocument = {
                delivery_document_type_id: 2,
                dealer_id: req.body.dealerOrShowroom,
                from_dealer_id: req.body.mainStock,
                date: MDate.getDateTime(),
                issuer: req.user.username,
                notes: req.body.notes,
                officer_responsible: req.body.officerResponsible,
                officer_telephone: req.body.officerTelephone,
                vehicle_no: req.body.vehicleNo,
                driver_name: req.body.driverName,
                driver_nic: req.body.driverNic,
                driver_telephone: req.body.driverTelephone,
            }

            const primaryNumbers = req.body.primaryNumber
            const prices = req.body.price

            let machines = []
            let machinePrices = []

            if(primaryNumbers.constructor === Array) {
                for(let i = 0; i < primaryNumbers.length; i++) {
                    machines.push([primaryNumbers[i]])
                    machinePrices.push([prices[i]])
                }
            } else {
                machines.push([primaryNumbers])
                machinePrices.push([prices])
            }

            async.series([
                function(callback) {
                    Stock.newDeliveryNote(deliveryDocument, machines, machinePrices, callback)
                }
            ], function(err, data) {
                if(err) {
                    res.send("<br><div class='alert alert-warning'>" + err.code + "</div>")
                } else {
                    res.send("<br><div class='alert alert-info'>Delivery note issued successfully</div>")
                }
            })

        } else {
            res.send("<br><div class='alert alert-warning'>Main stock and/or dealer showroom validation error</div>")
        }
    })
})

router.get('/transferNote', function(req, res){
    async.series([
        function(callback) {
            Stock.getDealersAndShowrooms(callback)
        }
    ], function(err, data) {
        res.render('stock/stock/transferNote', {
            title: 'New Transfer Note',
            navbar: 'Stock',
            user: req.user,
            dealersAndShowrooms: data[0]
        })
    })
})

router.post('/transferNote', function(req, res) {

    if(req.body.fromDealerOrShowroom == req.body.toDealerOrShowroom) {
        res.send("<br><div class='alert alert-warning'>From and To locations are the same</div>")
        return
    }

    async.series([
        function(callback) {
            Stock.validateShowroomOrDealer(req.body.fromDealerOrShowroom, callback)
        }, function(callback) {
            Stock.validateShowroomOrDealer(req.body.toDealerOrShowroom, callback)
        }
    ], function(err, data) {
        if(data[0] == true && data[1] == true) {

            const deliveryDocument = {
                delivery_document_type_id: 3,
                dealer_id: req.body.toDealerOrShowroom,
                from_dealer_id: req.body.fromDealerOrShowroom,
                date: MDate.getDateTime(),
                issuer: req.user.username,
                notes: req.body.notes,
                officer_responsible: req.body.officerResponsible,
                officer_telephone: req.body.officerTelephone,
                vehicle_no: req.body.vehicleNo,
                driver_name: req.body.driverName,
                driver_nic: req.body.driverNic,
                driver_telephone: req.body.driverTelephone,
            }

            const primaryNumbers = req.body.primaryNumber
            const prices = req.body.price

            let machines = []
            let machinePrices = []

            if(primaryNumbers.constructor === Array) {
                for(let i = 0; i < primaryNumbers.length; i++) {
                    machines.push([primaryNumbers[i]])
                    machinePrices.push([prices[i]])
                }
            } else {
                machines.push([primaryNumbers])
                machinePrices.push([prices])
            }

            async.series([
                function(callback) {
                    Stock.newTransferNote(deliveryDocument, machines, machinePrices, callback)
                }
            ], function(err, data) {
                if(err) {
                    res.send("<br><div class='alert alert-warning'>" + err.code + "</div>")
                } else {
                    res.send("<br><div class='alert alert-info'>Transfer note issued successfully</div>")
                }
            })

        } else {
            res.send("<br><div class='alert alert-warning'>Location validation error</div>")
        }
    })
})

router.get('/returnNote', function(req, res){
    async.series([
        function(callback) {
            Stock.getMainStocks(callback)
        }, function(callback) {
            Stock.getDealersAndShowrooms(callback)
        }
    ], function(err, data) {
        res.render('stock/stock/returnNote', {
            title: 'New Return Note',
            navbar: 'Stock',
            user: req.user,
            mainStocks: data[0],
            dealersAndShowrooms: data[1]
        })
    })
})

router.post('/returnNote', function(req, res) {
    async.series([
        function(callback) {
            Stock.validateMainStock(req.body.mainStock, callback)
        }, function(callback) {
            Stock.validateShowroomOrDealer(req.body.dealerOrShowroom, callback)
        }
    ], function(err, data) {
        if(data[0] == true && data[1] == true) {

            const deliveryDocument = {
                delivery_document_type_id: 4,
                dealer_id: req.body.mainStock,
                from_dealer_id: req.body.dealerOrShowroom,
                date: MDate.getDateTime(),
                issuer: req.user.username,
                notes: req.body.notes,
                officer_responsible: req.body.officerResponsible,
                officer_telephone: req.body.officerTelephone,
                vehicle_no: req.body.vehicleNo,
                driver_name: req.body.driverName,
                driver_nic: req.body.driverNic,
                driver_telephone: req.body.driverTelephone,
            }

            const primaryNumbers = req.body.primaryNumber
            const prices = req.body.price

            let machines = []
            let machinePrices = []

            if(primaryNumbers.constructor === Array) {
                for(let i = 0; i < primaryNumbers.length; i++) {
                    machines.push([primaryNumbers[i]])
                    machinePrices.push([prices[i]])
                }
            } else {
                machines.push([primaryNumbers])
                machinePrices.push([prices])
            }

            async.series([
                function(callback) {
                    Stock.newReturnNote(deliveryDocument, machines, machinePrices, callback)
                }
            ], function(err, data) {
                if(err) {
                    res.send("<br><div class='alert alert-warning'>" + err.code + "</div>")
                } else {
                    res.send("<br><div class='alert alert-info'>Return note issued successfully</div>")
                }
            })

        } else {
            res.send("<br><div class='alert alert-warning'>Location validation error</div>")
        }
    })
})

router.get('/stock', function(req, res) {
    async.series([
        function(callback) {
            Stock.getMainStocks(callback)
        }, function(callback) {
            Stock.getDealersAndShowrooms(callback)
        }
    ], function(err, data) {
        res.render('stock/stock/stock', {
            title: 'Stock',
            navbar: 'Stock',
            user: req.user,
            mainStocks: data[0],
            dealersAndShowrooms: data[1]
        })
    })
})

router.get('/viewStock', function(req, res) {
    async.series([
        function(callback) {
            Stock.getStock(req.query.stockLocation, callback)
        }, function(callback) {
            Stock.getDealerOrShowroomDetails(req.query.stockLocation, callback)
        }, function(callback) {
            Stock.getSoldStock(req.query.stockLocation, callback)
        }
    ], function(err, data) {
        res.render('stock/stock/viewStock', {
            title: 'Stock',
            navbar: 'Stock',
            user: req.user,
            stocks: data[0],
            soldStocks: data[2],
            url: encodeURIComponent(req.originalUrl),
            showroomDealerDetails: data[1]
        })
    })
})

router.get('/stockDetails', function(req, res) {
    async.series([
        function(callback) {
            Stock.getStockHistory(req.query.primaryId, callback)
        }, function(callback) {
            Stock.getCurrentLocation(req.query.primaryId, callback)
        }
    ], function(err, data) {
        res.render('stock/stock/stockDetails', {
            title: 'Stock Details',
            navbar: 'Stock',
            user: req.user,
            stockHistories: data[0],
            currentLocation: data[1]
        })
    })
})

router.get('/allDeliveryDocuments', function(req, res) {

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
            Stock.getDeliveryDocuments(pageNumber, callback)
        }
    ], function(err, data) {
        res.render('stock/stock/allDeliveryDocuments', {
            title: 'All Delivery Documents',
            navbar: 'Stock',
            user: req.user,
            page: pageNumber,
            prev: prev,
            next: next,
            deliveryNotes: data[0]
        })
    })
})

router.get('/deliveryDocumentContent', function(req, res) {
    async.series([
        function(callback) {
            Stock.getDeliveryDocumentDetails(req.query.deliveryDocumentId, callback)
        }, function(callback) {
            Stock.getDeliveryDocumentContent(req.query.deliveryDocumentId, callback)
        }
    ], function(err, data) {
        res.render('stock/stock/deliveryDocumentContent', {
            title: 'Delivery Document',
            deliveryDocumentId: req.query.deliveryDocumentId,
            deliveryDocumentDetails: data[0],
            deliveryDocumentContents: data[1]
        })
    })
})

router.get('/dealer/add', function(req, res) {
    async.series([
        function(callback) {
            Region.getAllTerritories(callback)
        }
    ], function(err, data) {
        res.render('stock/stock/dealer/add', {
            title: 'Add Dealer',
            navbar: 'Stock',
            user: req.user,
            territories: data[0]
        })
    })
})

router.post('/dealer/add', function(req, res) {
    const dealer = {
        dealer_type_id: req.body.dealer_type,
        name: req.body.dealer_name,
        address: req.body.dealer_address,
        telephone: req.body.dealer_telephone,
        territory_id: req.body.territory
    }

    async.series([
        function(callback) {
            Stock.addDealer(dealer, callback)
        }
    ], function(err, data) {
        if(err) {
            req.flash('warning_msg', 'Error occurred while adding dealer.')
            res.redirect('/stock/dealer/add')
        } else {
            req.flash('warning_msg', 'Dealer added successfully.')
            res.redirect('/stock/dealer/add')
        }
    })
})

router.get('/dealer/all', function(req, res) {
    async.series([
        function(callback) {
            Stock.getAllDealers(callback)
        }
    ], function(err, data) {
        res.render('stock/stock/dealer/all', {
            title: 'All Dealers',
            navbar: 'Stock',
            dealers: data[0],
            user: req.user
        })
    })
})

router.get('/dealer/edit', function(req, res) {
    async.series([
        function(callback) {
            Stock.getDealerDetails(req.query.dealerId, callback)
        }, function(callback) {
            Region.getAllTerritories(callback)
        }
    ], function(err, data) {
        res.render('stock/stock/dealer/edit', {
            title: 'Edit Dealer',
            navbar: 'Stock',
            dealerId: req.query.dealerId,
            dealer: data[0],
            user: req.user,
            territories: data[1]
        })
    })
})

router.post('/dealer/edit/:dealerId', function(req, res) {
    async.series([
        function(callback) {
            Stock.updateDealerDetails(req.params.dealerId, req.body, callback)
        }
    ], function(err, data) {
        if(err) {
            req.flash('warning_msg', 'Failed to update dealer')
            res.redirect('/stock/dealer/all')
        } else {
            req.flash('success_msg', 'Dealer updated successfully')
        	res.redirect('/stock/dealer/all')
        }
    })
})

router.get('/search', function(req, res) {
    async.series([
        function(callback) {
            Stock.search(req.query.skw, callback)
        }
    ], function(err, data) {
        res.render('stock/stock/search', {
            title: 'Search',
            navbar: 'Stock',
            results: data[0],
            keyword: req.query.skw,
            url: encodeURIComponent(req.originalUrl),
            user: req.user
        })
    })
})

router.get('/search/print', function(req, res) {
    async.series([
        function(callback) {
            Stock.search(req.query.skw, callback)
        }
    ], function(err, data) {
        res.render('stock/stock/searchPrint', {
            title: 'Search',
            navbar: 'Stock',
            results: data[0],
            keyword: req.query.skw,
            url: encodeURIComponent(req.originalUrl),
            user: req.user
        })
    })
})

router.get('/markSold', function(req, res) {
    async.series([
        function(callback) {
            Stock.markSold(req.query.primaryId, callback)
        }
    ], function(err, data) {
        if(err) {
            req.flash('warning_msg', 'Failed to mark sold')
        	res.redirect(req.query.continue)
        } else {
            req.flash('success_msg', 'Stock ' + req.query.primaryId + ' marked sold successfully')
        	res.redirect(req.query.continue)
        }
    })
})

module.exports = router
