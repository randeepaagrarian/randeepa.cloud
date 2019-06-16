const express = require('express')
const async = require('async')

const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const Service = require('../../models/service/service')
const Stock = require('../../models/stock/stock')
const Sale = require('../../models/sale/sale')

router.use(Auth.signedIn, Auth.validServiceUser, function(req, res, next) {
    next()
})

router.get('/new', function(req, res) {
    async.series([
        function(callback) {
            Stock.getModels(callback)
        }, function(callback) {
            Stock.getDealersAndShowrooms(callback)
        }
    ], function(err, data) {
        res.render('service/new', {
            title: 'New Service',
            navbar: 'Service',
            user: req.user,
            models: data[0],
            dealersAndShowrooms: data[1]
        })
    })
})

router.post('/new', function(req, res) {

    if(req.body.issue == '') {
        req.flash('warning_msg', 'Please enter the issue')
        res.redirect('/service/new')
    }

    let service = {}

    for(let key in req.body) {
        if(req.body[key] == '' || req.body[key] == -1)
            continue
        service[key] = req.body[key]
    }

    service['date'] = MDate.getDateTime()

    async.series([
        function(callback) {
            Service.newService(service, callback)
        }
    ], function(err, data) {
        if(data[0] == true) {
            req.flash('warning_msg', 'Service successfully opened')
            res.redirect('/service/new')
        } else {
            req.flash('warning_msg', 'Failed to open service')
            res.redirect('/service/new')
        }
    })

})

router.get('/date', function(req, res) {
    async.series([
        function(callback) {
            Service.byDate(req.query.startDate, req.query.endDate, callback)
        }
    ], function(err, data) {
        res.render('service/bydate', {
            title: 'Services By Date',
            navbar: 'Service',
            user: req.user,
            services: data[0],
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            results: data[0].length
        })
    })
})

router.get('/byofficer/date', function(req, res) {
    async.series([
        function(callback) {
            Service.byDateTechnician(req.query.startDate, req.query.endDate, req.query.technician, callback)
        }
    ], function(err, data) {
        res.render('service/bydateofficer', {
            title: 'Services By Date Officer',
            navbar: 'Service',
            user: req.user,
            services: data[0],
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            technician: req.query.technician,
            results: data[0].length
        })
    })
})

router.get('/searchByServiceID', function(req, res) {
    async.series([
        function(callback) {
            Service.searchByServiceID(req.query.serviceID, callback)
        }
    ], function(err, data) {
        res.render('service/searchByServiceID', {
            title: 'Services By Date Officer',
            navbar: 'Service',
            user: req.user,
            services: data[0],
            serviceID: req.query.serviceID,
            results: data[0].length
        })
    })
})

router.get('/serviceInfo', function(req, res){
    async.series([
        function(callback) {
            Service.saleIDEntered(req.query.serviceID, callback)
        }
    ], function(err, data) {

        let saleID = data[0][0].sale_id

        if(saleID != null) {
            async.series([
                function(callback) {
                    Service.serviceInfo(req.query.serviceID, callback)
                }, function(callback){
                    Service.getTechnicians(callback)
                }, function(callback) {
                    Service.allocatedTechnician(req.query.serviceID, callback)
                }, function(callback) {
                    Service.allocatedTechnicianHistory(req.query.serviceID, callback)
                }, function(callback) {
                    Sale.cloudIDInfo(saleID, callback)
                }
            ], function(err, data) {
                res.render('service/serviceInfo', {
                    title: 'Service Info',
                    navbar: 'Service',
                    user: req.user,
                    serviceInfo: data[0],
                    saleIDEntered: true,
                    technicians: data[1],
                    allocatedTechnician: data[2],
                    allocatedTechnicianHistory: data[3],
                    sales: data[4]
                })
            })
        } else {
            async.series([
                function(callback) {
                    Service.serviceInfo(req.query.serviceID, callback)
                }, function(callback){
                    Service.getTechnicians(callback)
                }, function(callback) {
                    Service.allocatedTechnician(req.query.serviceID, callback)
                }, function(callback) {
                    Service.allocatedTechnicianHistory(req.query.serviceID, callback)
                }
            ], function(err, data) {
                res.render('service/serviceInfo', {
                    title: 'Service Info',
                    navbar: 'Service',
                    user: req.user,
                    serviceInfo: data[0],
                    saleIDEntered: false,
                    technicians: data[1],
                    allocatedTechnician: data[2],
                    allocatedTechnicianHistory: data[3]
                })
            })
        }
    })
})

router.post('/allocateTechnician/:serviceID', function(req, res) {
    let technician = {
        technician_id: req.body.technician,
        technician_allocated: 1,
        technician_allocated_by: req.user.username,
        technician_allocated_on: MDate.getDateTime()
    }

    async.series([
        function(callback) {
            Service.updateService(technician, req.params.serviceID, callback)
        }
    ], function(err, data) {
        if(data[0] == true) {
            req.flash('success_msg', 'Technician allocated')
            res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
        } else {
            req.flash('warning_msg', 'Failed to allocated technician')
            res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
        }
    })
})

router.post('/changeTechnician/:serviceID', function(req, res) {

    if(req.body.reason == '') {
        req.flash('warning_msg', 'Please specify the reason for technician change')
        res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
        return
    }

    let timeNow = MDate.getDateTime()

    let technician = {
        technician_id: req.body.technician,
        technician_allocated_by: req.user.username,
        technician_allocated_on: timeNow
    }

    async.series([
        function(callback) {
            Service.changeTechnician(req.params.serviceID, timeNow, req.user.username, req.body.reason, technician, callback)
        }
    ], function(err, data) {
        if(data[0] == true) {
            req.flash('success_msg', 'Technician successfully changed')
            res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
            return
        } else {
            req.flash('warning_msg', 'Failed to change technician')
            res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
            return
        }
    })
})

router.post('/serviceComplete/:serviceID', function(req, res) {

    if(req.body.remarks == '') {
        req.flash('warning_msg', 'Please enter the remarks')
        res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
        return
    }

    let service = {
        service_completed: 1,
        service_completed_remarks: req.body.remarks,
        service_completed_by: req.user.username,
        service_completed_on: MDate.getDateTime()
    }

    async.series([
        function(callback) {
            Service.updateService(service, req.params.serviceID, callback)
        }
    ], function(err, data) {
        if(data[0] == true) {
            req.flash('success_msg', 'Service successfully completed')
            res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
            return
        } else {
            req.flash('warning_msg', 'Failed to complete service')
            res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
            return
        }
    })
})

module.exports = router
