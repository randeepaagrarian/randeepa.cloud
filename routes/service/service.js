const express = require('express')
const async = require('async')
const multiparty = require('connect-multiparty')
const Cloudinary = require('../../models/comms/cloudinary')

const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const Service = require('../../models/service/service')
const Stock = require('../../models/stock/stock')
const Sale = require('../../models/sale/sale')

const multipart = multiparty()

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

router.post('/new', multipart, function(req, res) {

    if(req.body.issue == '') {
        req.flash('warning_msg', 'Please enter the issue')
        res.redirect('/service/new')
        return
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
            return
        } else {
            req.flash('warning_msg', 'Failed to open service')
            res.redirect('/service/new')
            return
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
            title: 'Services By Service ID',
            navbar: 'Service',
            user: req.user,
            services: data[0],
            serviceID: req.query.serviceID,
            results: data[0].length
        })
    })
})

router.get('/searchByChassisNo', function(req, res) {
    async.series([
        function(callback) {
            Service.searchByChassisNo(req.query.chassisNo, callback)
        }
    ], function(err, data) {
        res.render('service/searchByServiceID', {
            title: 'Services By Chassis No',
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
                    Service.getComments(req.query.serviceID, callback)
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
                    comments: data[4],
                    sales: data[5]
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
                }, function(callback) {
                    Service.getComments(req.query.serviceID, callback)
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
                    allocatedTechnicianHistory: data[3],
                    comments: data[4]
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

router.post('/uploadWorksheet/:serviceID', multipart, function(req, res) {
    if(req.files.attachment.originalFilename == '') {
        req.flash('warning_msg', 'Please select the worksheet to upload')
        res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
        return
    }

    const attachmentExtension = req.files.attachment.originalFilename.split('.').pop().toLowerCase()

    if(attachmentExtension == 'jpg' || attachmentExtension == 'jpeg' || attachmentExtension == 'png' || attachmentExtension == 'JPG' || attachmentExtension == 'JPEG' || attachmentExtension == 'PNG') {
        async.series([
            function(callback) {
                Cloudinary.upload(req.files.attachment.path, callback)
            }
        ], function(err, uploadData) {
            if(uploadData[0].error) {
                req.flash('warning_msg', 'Error occured while uploading worksheet')
                res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
                return
            }

            let worksheet = {
                work_sheet: uploadData[0].url,
                work_sheet_uploaded_by: req.user.username,
                work_sheet_uploaded_on: MDate.getDateTime()
            }

            async.series([
                function(callback) {
                    Service.updateService(worksheet, req.params.serviceID, callback)
                }
            ], function(err, data) {
                if(data[0] == true) {
                    req.flash('success_msg', 'Worksheet successfully uploaded')
                    res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
                    return
                } else {
                    req.flash('warning_msg', 'Failed to upload worksheet')
                    res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
                    return
                }
            })
        })
    } else {
        req.flash('warning_msg', 'Invalid file format')
        res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
        return
    }
})

router.post('/addComment/:serviceID', multipart, function(req, res) {
    if(req.body.comment == '') {
        req.flash('warning_msg', 'Please enter the comment')
        res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
        return
    }

    let comment = {
        service_id: req.params.serviceID,
        username: req.user.username,
        date: MDate.getDateTime(),
        text: req.body.comment
    }

    async.series([
        function(callback) {
            Service.addComment(comment, callback)
        }
    ], function(err, data) {
        if(data[0] == true) {
            req.flash('success_msg', 'Comment added')
            res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
            return
        } else {
            req.flash('warning_msg', 'Failed to add comment')
            res.redirect('/service/serviceInfo?serviceID=' + req.params.serviceID)
            return
        }
    })

})

module.exports = router
