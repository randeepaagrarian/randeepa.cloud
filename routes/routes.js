const express = require('express')
const async = require('async')
const Cloudinary = require('../models/comms/cloudinary')
const multiparty = require('connect-multiparty')
const router = express.Router()

const Auth = require('../functions/auth')
const MDate = require('../functions/mdate')

const Driver = require('../models/routes/driver')
const Supporter = require('../models/routes/supporter')
const Route = require('../models/routes/route')
const Vehicle = require('../models/routes/vehicle')
const Invoice = require('../models/routes/invoice')

const multipart = multiparty()

router.use(Auth.signedIn, Auth.validDriverRouteUser, function(req, res, next) {
    next()
})

router.get('/all', function(req, res) {
    async.series([
        function(callback) {
            Route.all(callback)
        }
    ], function(err, details) {
        res.render('routes/all', {
            navbar: 'Routes',
            title: 'All Routes',
            user: req.user,
            routes: details[0],
            results: details[0].length
        })
    })
})

router.get('/add', function(req, res) {
    async.series([
        function(callback) {
            Driver.getAll(callback)
        },
        function(callback) {
            Supporter.getAll(callback)
        }
    ], function(err, details) {
        res.render('routes/add', {
            navbar: 'Routes',
            title: 'Add Route',
            user: req.user,
            drivers: details[0],
            supporters: details[1]
        })
    })
})

router.post('/add', multipart, function(req, res) {
    var route = {}

    for(var key in req.body) {
		route[key] = req.body[key]
	}

    async.series([
        function(callback) {
            Cloudinary.upload(req.files.document_front.path, callback)
        }
    ], function(err, details) {
        route['document_front'] = details[0].url
        route['sys_time'] = MDate.getDateTime()

        async.series([
            function(callback) {
                Route.add(route, callback)
            }
        ], function(err, details) {
            if(details[0] == true) {
                req.flash('warning_msg', 'Route successfully added.')
                res.redirect('/routes/add')
            }
        })
    })
})

router.get('/search', function(req, res) {
    res.send('Temporary Unavailable')
    // if(req.query.skw && !(req.query.skw == '')) {
    //     async.series([
    //         function(callback) {
    //             Route.search(req.query.skw, callback)
    //         }
    //     ], function(err, details) {
    //         res.render('routes/search_route', {
    //             title: 'Search Route',
    //             user: req.user,
    //             noOfResults: details[0].length,
    //             keyword: req.query.skw,
    //             routes: details[0]
    //         })
    //     })
    // } else {
    //     res.render('routes/search_route', {
    //         title: 'Search Route',
    //         user: req.user
    //     })
    // }
})

router.get('/driver/all', function(req, res) {
    async.series([
        function(callback) {
            Driver.getAll(callback)
        }
    ], function(err, details) {
        res.render('routes/driver/all', {
            title: 'All Drivers',
            user: req.user,
            drivers: details[0]
        })
    })
})

router.get('/supporter/all', function(req, res) {
    async.series([
        function(callback) {
            Supporter.getAll(callback)
        }
    ], function(err, details) {
        res.render('routes/supporter/all', {
            title: 'All Supporters',
            user: req.user,
            supporters: details[0]
        })
    })
})

router.get('/driver/add', function(req, res) {
    res.render('routes/driver/add', {
        title: 'Add Driver',
        user: req.user
    })
})

router.get('/supporter/add', function(req, res) {
    res.render('routes/supporter/add', {
        title: 'Add Supporter',
        user: req.user
    })
})

router.post('/driver/add', multipart, function(req, res) {
    var driver = {}

    for(var key in req.body) {
		driver[key] = req.body[key]
	}

    async.series([
        function(callback) {
            Cloudinary.upload(req.files.image.path, callback)
        }
    ], function(err, details) {
        driver['image'] = details[0].url

        async.series([
            function(callback) {
                Driver.add(driver, callback)
            }
        ], function(err, add_details) {
            if(add_details[0] != true) {
                req.flash('warning_msg', 'Failed to add user')
            	res.redirect('/routes/driver/add')
            } else {
                req.flash('warning_msg', 'Driver added successfully')
            	res.redirect('/routes/driver/add')
            }
        })
    })
})

router.post('/supporter/add', multipart, function(req, res) {
    var supporter = {}

    for(var key in req.body) {
		supporter[key] = req.body[key]
	}

    async.series([
        function(callback) {
            Cloudinary.upload(req.files.image.path, callback)
        }
    ], function(err, details) {
        supporter['image'] = details[0].url

        async.series([
            function(callback) {
                Supporter.add(supporter, callback)
            }
        ], function(err, add_details) {
            if(add_details[0] != true) {
                req.flash('warning_msg', 'Failed to add user')
            	res.redirect('/routes/supporter/add')
            } else {
                req.flash('warning_msg', 'Supporter added successfully')
            	res.redirect('/routes/supporter/add')
            }
        })
    })
})

router.get('/driver/search', function(req, res) {
    res.send('Search driver')
})

router.get('/supporter/search', function(req, res) {
    res.send('Search supporter')
})

router.get('/monthly-routes/driver', function(req, res) {
    async.series([
        function(callback) {
            Driver.monthlyRoutes(req.query.driverid, req.query.year, req.query.month, callback)
        },
        function(callback) {
            Driver.getDetails(req.query.driverid, callback)
        }
    ], function(err, details) {
        async.series([
            function(callback) {
                Driver.calculateSummary(req.query.year, req.query.month, details[0], callback)
            }
        ], function(err, summary){
            res.render('routes/monthly_routes/driver', {
                title: 'Monthly Routes',
                routes: details[0],
                driver: details[1],
                summary: summary[0],
                year: req.query.year,
                month: req.query.month
            })
        })
    })
})

router.get('/monthly-routes/supporter', function(req, res) {
    async.series([
        function(callback) {
            Supporter.monthlyRoutes(req.query.supporterid, req.query.year, req.query.month, callback)
        },
        function(callback) {
            Supporter.getDetails(req.query.supporterid, callback)
        }
    ], function(err, details) {
        async.series([
            function(callback) {
                Supporter.calculateSummary(req.query.year, req.query.month, details[0], callback)
            }
        ], function(err, summary){
            res.render('routes/monthly_routes/supporter', {
                title: 'Monthly Routes',
                routes: details[0],
                supporter: details[1],
                summary: summary[0],
                year: req.query.year,
                month: req.query.month
            })
        })
    })
})

router.get('/monthly-routes/vehicle', function(req, res) {
    async.series([
        function(callback) {
            Vehicle.monthlyRoutes(req.query.vehicleid, req.query.year, req.query.month, callback)
        }
    ], function(err, details) {
        async.series([
            function(callback) {
                Vehicle.calculateSummary(details[0], callback)
            }
        ], function(err, summary) {
            res.render('routes/monthly_routes/vehicle', {
                title: 'Monthly Routes',
                routes: details[0],
                vehicle: req.query.vehicleid,
                summary: summary[0],
                year: req.query.year,
                month: req.query.month
            })
        })
    })
})

router.get('/invoice/issue', function(req, res) {
    async.series([
        function(callback) {
            Invoice.getUnbilledRoutes(callback)
        }
    ], function(err, details) {
        res.render('routes/invoice/issue', {
            navbar: 'Routes',
            title: 'Issue Invoice',
            user: req.user,
            routes: details[0]
        })
    })
})

router.post('/invoice/issue', function(req, res) {

    const invoice = {
        date: MDate.getDate('-'),
        issuer: req.user.username
    }

    async.series([
        function(callback) {
            Invoice.create(invoice, callback)
        }
    ], function(err, details) {

        console.log(req.body)

        var contents = []

        if(req.body.invoice_routes.constructor === Array) {
            for(i = 0; i < req.body.invoice_routes.length; i++) {
                contents[i] = [details[0].insertId, req.body.invoice_routes[i], req.body[req.body.invoice_routes[i]]]
            }
        } else {
            contents.push([details[0].insertId, req.body.invoice_routes, req.body[req.body.invoice_routes]])
        }

        console.log(contents)

        async.series([
            function(callback) {
                Invoice.addContents(contents, callback)
            },
            function(callback) {
                Invoice.markRoutesBilled(req.body.invoice_routes, callback)
            }
        ], function(err, contents_details) {
            if(contents_details[0] == true && contents_details[1] == true) {
                req.flash('warning_msg', 'Invoice issued successfully')
                res.redirect('/routes/invoice/issue')
            }
        })
    })
})

router.get('/invoice/all', function(req, res) {
    async.series([
        function(callback) {
            Invoice.getAll(callback)
        }
    ], function(err, details) {
        res.render('routes/invoice/all', {
            navbar: 'Routes',
            title: 'All Invoices',
            user: req.user,
            invoices: details[0],
            results: details[0].length
        })
    })
})

router.get('/invoice/view', function(req, res) {
    async.series([
        function(callback) {
            Invoice.getContents(req.query.invoiceID, callback)
        }
    ], function(err, details) {
        async.series([
            function(callback) {
                Invoice.getSummary(details[0], callback)
            },
            function(callback) {
                Invoice.getDetails(req.query.invoiceID, callback)
            }
        ], function(err, summary) {
            res.render('routes/invoice/view', {
                title: 'Invoice Contents',
                user: req.user,
                invoiceID: req.query.invoiceID,
                routes: details[0],
                summary: summary[0],
                invoiceDetails: summary[1]
            })
        })
    })
})

module.exports = router
