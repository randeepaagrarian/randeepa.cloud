const express = require('express')
const async = require('async')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')
const SalesFunctions = require('../../functions/sale')

const Sale = require('../../models/sale/sale')

router.use(Auth.signedIn, Auth.validSaleUser, Auth.saleExcelDownloadAllowed, function(req, res, next) {
    next()
})

router.get('/today/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actToday(MDate.getDate('-'), callback)
        }
    ], function(err, details) {
        res.render('sale/today', {
            url: req.url,
            navbar: 'Sales',
            title: 'Today Sales by Actual Date',
            user: req.user,
            date: MDate.getDate('-'),
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/today/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actToday(MDate.getDate('-'), callback)
        }
    ], function(err, details) {
        res.xls('All ' + MDate.getDate('-') + ' Actual.xlsx', details[0])
    })
})

router.get('/today/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysToday(MDate.getDate('-'), callback)
        }
    ], function(err, details) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.render('sale/today', {
            url: req.url,
            navbar: 'Sales',
            title: 'Today Sales by Cloud Date',
            user: req.user,
            date: MDate.getDate('-'),
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/today/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysToday(MDate.getDate('-'), callback)
        }
    ], function(err, details) {
        res.xls('All ' + MDate.getDate('-') + ' Sys.xlsx', details[0])
    })
})

router.get('/all', function(req, res) {

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
            Sale.all(pageNumber, callback)
        }
    ], function(err, details) {

        res.render('sale/all', {
            url: req.url,
            navbar: 'Sales',
            title: 'All Sales',
            user: req.user,
            prev: prev,
            next: next,
            sales: details[0],
            results: details[0].length,
            modelSummary: SalesFunctions.modelSummary(details[0])
        })
    })
})

router.get('/excel/all', function(req, res) {
    async.series([
        function(callback) {
            Sale.all(callback)
        }
    ], function(err, details) {
        res.xls('All.xlsx', details[0])
    })
})

router.get('/date/all/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByDateAll(req.query.year, req.query.month, req.query.date, callback)
        }
    ], function(err, details) {
        res.render('sale/by_date/all', {
            url: req.url,
            navbar: 'Sales',
            title: 'All Sales By Actual Date',
            user: req.user,
            date: req.query.year + '-' + req.query.month + '-' + req.query.date,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/date/all/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByDateAll(req.query.year, req.query.month, req.query.date, callback)
        }
    ], function(err, details) {
        res.xls('All '+req.query.year+req.query.month+req.query.date+' Actual.xlsx', details[0])
    })
})

router.get('/date/all/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByDateAll(req.query.year, req.query.month, req.query.date, callback)
        }
    ], function(err, details) {
        res.render('sale/by_date/all', {
            url: req.url,
            navbar: 'Sales',
            title: 'All Sales By Cloud Date',
            user: req.user,
            date: req.query.year + '-' + req.query.month + '-' + req.query.date,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/date/all/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByDateAll(req.query.year, req.query.month, req.query.date, callback)
        }
    ], function(err, details) {
        res.xls('All '+req.query.year+req.query.month+req.query.date+' Sys.xlsx', details[0])
    })
})

router.get('/date/region/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByDateRegion(req.query.year, req.query.month, req.query.date, req.query.region, callback)
        }
    ], function(err, details) {
        res.render('sale/by_date/region', {
            url: req.url,
            navbar: 'Sales',
            title: 'Regional Sales By Actual Date',
            user: req.user,
            region: req.query.region,
            date: req.query.year + '-' + req.query.month + '-' + req.query.date,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/date/region/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByDateRegion(req.query.year, req.query.month, req.query.date, req.query.region, callback)
        }
    ], function(err, details) {
        res.xls('Region '+req.query.region + ' ' +req.query.year+req.query.month+req.query.date+' Actual.xlsx', details[0])
    })
})

router.get('/date/region/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByDateRegion(req.query.year, req.query.month, req.query.date, req.query.region, callback)
        }
    ], function(err, details) {
        res.render('sale/by_date/region', {
            url: req.url,
            navbar: 'Sales',
            title: 'Regional Sales By Cloud Date',
            user: req.user,
            region: req.query.region,
            date: req.query.year + '-' + req.query.month + '-' + req.query.date,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/date/region/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByDateRegion(req.query.year, req.query.month, req.query.date, req.query.region, callback)
        }
    ], function(err, details) {
        res.xls('Region '+req.query.region + ' ' +req.query.year+req.query.month+req.query.date+' Sys.xlsx', details[0])
    })
})

router.get('/date/officer/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByDateOfficer(req.query.year, req.query.month, req.query.date, req.query.officer, callback)
        }
    ], function(err, details) {
        res.render('sale/by_date/officer', {
            url: req.url,
            navbar: 'Sales',
            title: 'Officer Sales By Actual Date',
            user: req.user,
            officer: req.query.officer,
            date: req.query.year + '-' + req.query.month + '-' + req.query.date,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/date/officer/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByDateOfficer(req.query.year, req.query.month, req.query.date, req.query.officer, callback)
        }
    ], function(err, details) {
        res.xls('Officer '+req.query.officer + ' ' +req.query.year+req.query.month+req.query.date+' Actual.xlsx', details[0])
    })
})

router.get('/date/officer/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByDateOfficer(req.query.year, req.query.month, req.query.date, req.query.officer, callback)
        }
    ], function(err, details) {
        res.render('sale/by_date/officer', {
            url: req.url,
            navbar: 'Sales',
            title: 'Officer Sales By Cloud Date',
            user: req.user,
            officer: req.query.officer,
            date: req.query.year + '-' + req.query.month + '-' + req.query.date,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/date/officer/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByDateOfficer(req.query.year, req.query.month, req.query.date, req.query.officer, callback)
        }
    ], function(err, details) {
        res.xls('Officer '+req.query.officer + ' ' +req.query.year+req.query.month+req.query.date+' Sys.xlsx', details[0])
    })
})

router.get('/month/all/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByMonthAll(req.query.year, req.query.month, callback)
        }
    ], function(err, details) {
        res.render('sale/by_month/all', {
            url: req.url,
            navbar: 'Sales',
            title: 'All Sales By Actual Month',
            user: req.user,
            date: req.query.year + '-' + req.query.month,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/month/all/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByMonthAll(req.query.year, req.query.month, callback)
        }
    ], function(err, details) {
        res.xls('All '+req.query.year+req.query.month+' Actual.xlsx', details[0])
    })
})

router.get('/month/all/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByMonthAll(req.query.year, req.query.month, callback)
        }
    ], function(err, details) {
        res.render('sale/by_month/all', {
            url: req.url,
            navbar: 'Sales',
            title: 'All Sales By Cloud Month',
            user: req.user,
            date: req.query.year + '-' + req.query.month,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/month/all/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByMonthAll(req.query.year, req.query.month, callback)
        }
    ], function(err, details) {
        res.xls('All '+req.query.year+req.query.month+' Sys.xlsx', details[0])
    })
})

router.get('/month/region/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByMonthRegion(req.query.year, req.query.month, req.query.region, callback)
        }
    ], function(err, details) {
        res.render('sale/by_month/region', {
            url: req.url,
            navbar: 'Sales',
            title: 'Regional Sales By Actual Month',
            user: req.user,
            region: req.query.region,
            date: req.query.year + '-' + req.query.month,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/month/region/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByMonthRegion(req.query.year, req.query.month, req.query.region, callback)
        }
    ], function(err, details) {
        res.xls('Region '+req.query.region+' '+req.query.year+req.query.month+' Actual.xlsx', details[0])
    })
})

router.get('/month/region/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByMonthRegion(req.query.year, req.query.month, req.query.region, callback)
        }
    ], function(err, details) {
        res.render('sale/by_month/region', {
            url: req.url,
            navbar: 'Sales',
            title: 'Regional Sales By Cloud Month',
            user: req.user,
            region: req.query.region,
            date: req.query.year + '-' + req.query.month,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/month/region/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByMonthRegion(req.query.year, req.query.month, req.query.region, callback)
        }
    ], function(err, details) {
        res.xls('Region '+req.query.region+' '+req.query.year+req.query.month+' Sys.xlsx', details[0])
    })
})

router.get('/month/officer/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByMonthOfficer(req.query.year, req.query.month, req.query.officer, callback)
        }
    ], function(err, details) {
        res.render('sale/by_month/officer', {
            url: req.url,
            navbar: 'Sales',
            title: 'Officer Sales By Actual Month',
            user: req.user,
            officer: req.query.officer,
            date: req.query.year + '-' + req.query.month,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/month/officer/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByMonthOfficer(req.query.year, req.query.month, req.query.officer, callback)
        }
    ], function(err, details) {
        res.xls('Officer '+req.query.officer+' '+req.query.year+req.query.month+' Actual.xlsx', details[0])
    })
})

router.get('/month/officer/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByMonthOfficer(req.query.year, req.query.month, req.query.officer, callback)
        }
    ], function(err, details) {
        res.render('sale/by_month/officer', {
            url: req.url,
            navbar: 'Sales',
            title: 'Officer Sales By Cloud Month',
            user: req.user,
            officer: req.query.officer,
            date: req.query.year + '-' + req.query.month,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/month/officer/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByMonthOfficer(req.query.year, req.query.month, req.query.officer, callback)
        }
    ], function(err, details) {
        res.xls('Officer '+req.query.officer+' '+req.query.year+req.query.month+' Sys.xlsx', details[0])
    })
})

router.get('/year/all/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByYearAll(req.query.year, callback)
        }
    ], function(err, details) {
        res.render('sale/by_year/all', {
            url: req.url,
            navbar: 'Sales',
            title: 'All Sales By Actual Year',
            user: req.user,
            date: req.query.year,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/year/all/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByYearAll(req.query.year, callback)
        }
    ], function(err, details) {
        res.xls('All '+req.query.year + ' Actual.xlsx', details[0])
    })
})

router.get('/year/all/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByYearAll(req.query.year, callback)
        }
    ], function(err, details) {
        res.render('sale/by_year/all', {
            url: req.url,
            navbar: 'Sales',
            title: 'All Sales By Cloud Year',
            user: req.user,
            date: req.query.year,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/year/all/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByYearAll(req.query.year, callback)
        }
    ], function(err, details) {
        res.xls('All '+req.query.year + ' Sys.xlsx', details[0])
    })
})

router.get('/year/region/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByYearRegion(req.query.year, req.query.region, callback)
        }
    ], function(err, details) {
        res.render('sale/by_year/region', {
            url: req.url,
            navbar: 'Sales',
            title: 'Regional Sales By Actual Year',
            user: req.user,
            region: req.query.region,
            date: req.query.year,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/year/region/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByYearRegion(req.query.year, req.query.region, callback)
        }
    ], function(err, details) {
        res.xls('Region '+req.query.region+ ' ' +req.query.year + ' Actual.xlsx', details[0])
    })
})

router.get('/year/region/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByYearRegion(req.query.year, req.query.region, callback)
        }
    ], function(err, details) {
        res.render('sale/by_year/region', {
            url: req.url,
            navbar: 'Sales',
            title: 'Regional Sales By Cloud Year',
            user: req.user,
            region: req.query.region,
            date: req.query.year,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/year/region/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByYearRegion(req.query.year, req.query.region, callback)
        }
    ], function(err, details) {
        res.xls('Region '+req.query.region+ ' ' +req.query.year + ' Sys.xlsx', details[0])
    })
})

router.get('/year/officer/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByYearOfficer(req.query.year, req.query.officer, callback)
        }
    ], function(err, details) {
        res.render('sale/by_year/officer', {
            url: req.url,
            navbar: 'Sales',
            title: 'Officer Sales By Actual Year',
            user: req.user,
            officer: req.query.officer,
            date: req.query.year,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/year/officer/actualdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.actByYearOfficer(req.query.year, req.query.officer, callback)
        }
    ], function(err, details) {
        res.xls('Officer '+req.query.officer+ ' ' +req.query.year + ' Actual.xlsx', details[0])
    })
})

router.get('/year/officer/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByYearOfficer(req.query.year, req.query.officer, callback)
        }
    ], function(err, details) {
        res.render('sale/by_year/officer', {
            url: req.url,
            navbar: 'Sales',
            title: 'Officer Sales By Cloud Year',
            user: req.user,
            officer: req.query.officer,
            date: req.query.year,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/year/officer/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByYearOfficer(req.query.year, req.query.officer, callback)
        }
    ], function(err, details) {
        res.xls('Officer '+req.query.officer+ ' ' +req.query.year + ' Sys.xlsx', details[0])
    })
})

module.exports = router
