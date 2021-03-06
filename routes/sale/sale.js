const express = require('express')
const async = require('async')
const request = require('request')
const Cloudinary = require('../../models/comms/cloudinary')
const multiparty = require('connect-multiparty')
const args = require('yargs').argv

const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')
const SalesFunctions = require('../../functions/sale')

const Sale = require('../../models/sale/sale')
const Notification = require('../../models/notification/notification')
const User = require('../../models/user/user')
const Region = require('../../models/region/region')
const Stock = require('../../models/stock/stock')

const multipart = multiparty()

router.use(Auth.signedIn, Auth.validSaleUser, Auth.saleExcelDownloadAllowed, function(req, res, next) {
    next()
})

router.get('/log', Auth.validSalesEditor, function(req, res) {
  async.series([
    function(callback) {
      Sale.getLogCurrent(req.query.cloudID, callback)
    }, function(callback) {
      Sale.getLogLogs(req.query.cloudID, callback)
    }
  ], function(err, data) {
    res.render('sale/log', {
      current: data[0],
      logs: data[1]
    })
  })
})

router.get('/incompleteSales', function(req, res) {
    async.series([
        function(callback) {
            if(req.query.filter == 'all') {
                Sale.incompleteSales(req.query.startDate, req.query.endDate, callback)
            } else if(req.query.filter == 'hp'){
                Sale.incompleteSalesHP(req.query.startDate, req.query.endDate, callback)
            } else if(req.query.filter == 'allexhp') {
                Sale.incompleteSalesExHP(req.query.startDate, req.query.endDate, callback)
            } else {
                res.redirect('/')
                return
            }
        }
    ], function(err, details) {
        res.render('sale/incompleteSales', {
            url: req.url,
            navbar: 'Sales',
            title: 'Incomplete Sales',
            user: req.user,
            url: req.url,
            filter: req.query.filter,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/incompleteSales', function(req, res) {
    async.series([
        function(callback) {
            if(req.query.filter == 'all') {
                Sale.incompleteSales(req.query.startDate, req.query.endDate, callback)
            } else if(req.query.filter == 'hp'){
                Sale.incompleteSalesHP(req.query.startDate, req.query.endDate, callback)
            } else if(req.query.filter == 'allexhp') {
                Sale.incompleteSalesExHP(req.query.startDate, req.query.endDate, callback)
            } else {
                res.redirect('/')
                return
            }
        }
    ], function(err, details) {
        res.xls('Incomplete Sales '+req.query.startDate+ ' ' +req.query.endDate+'.xlsx', details[0])
    })
})

router.get('/searchSalesByModel', function(req, res) {
  async.series([
      function(callback) {
          Sale.searchSalesModelGroup(req.query.startDate, req.query.endDate, req.query.model, req.query.modelGroup, callback)
      }

  ], function(err, details) {
  
      res.render('sale/searchSalesByModel', {
          url: req.url,
          navbar: 'Sales Result',
          title: 'Search Result By Model ',
          sales: details[0],
          user: req.user,
          url: req.url,
          startDate: req.query.startDate,
          endDate: req.query.endDate,
          modelSummary: SalesFunctions.modelSummary(details[0]),
          results: details[0].length
      })
  })
})

router.get('/excel/searchSalesByModel', function(req, res) {
  async.series([
      function(callback) {
        Sale.searchSalesModelGroup(req.query.startDate, req.query.endDate, req.query.model, req.query.modelGroup, callback)
      }
  ], function(err, details) {
      res.xls('Search Sales Results '+req.query.startDate+ ' ' +req.query.endDate+'.xlsx', details[0])
  })
})

router.get('/searchSalesByModel', function(req, res) {
  async.series([
      function(callback) {
          Sale.searchSalesModelGroup(req.query.startDate, req.query.endDate, req.query.model, req.query.modelGroup, callback)
      }

  ], function(err, details) {
  
      res.render('sale/searchSalesByModel', {
          url: req.url,
          navbar: 'Sales Result',
          title: 'Search Result By Model ',
          sales: details[0],
          user: req.user,
          url: req.url,
          startDate: req.query.startDate,
          endDate: req.query.endDate,
          modelSummary: SalesFunctions.modelSummary(details[0]),
          results: details[0].length
      })
  })
})



router.get('/edit', Auth.validSalesEditor, function(req, res) {
  async.series([
    function(callback) {
      Sale.saleRawInfo(req.query.cloudID, callback)
    }, function(callback) {
      User.getAllUsers(callback)
    }, function(callback) {
      Region.getAllRegions(callback)
    }, function(callback) {
      Region.getAllTerritories(callback)
    }, function(callback) {
      Stock.getModels(callback)
    }, function(callback) {
      Sale.getSaleTypes(callback)
    }, function(callback) {
      Stock.getDealersAndShowrooms(callback)
    }, function(callback) {
      Sale.getSaleCompletedTypes(callback)
    }
  ], function(err, data) {
    res.render('sale/edit', {
      navbar: 'Sales',
      title: 'Edit Sale',
      user: req.user,
      sale: data[0][0],
      users: data[1],
      regions: data[2],
      territories: data[3],
      models: data[4],
      saleTypes: data[5],
      dealers: data[6],
      saleCompletedTypes: data[7]
    })
  })
})

router.post('/edit/:cloudID', Auth.validSalesEditor, function(req, res) {
  let newSale = {}

  for(let key in req.body) {
    newSale[key] = decodeURIComponent(req.body[key])
  }

  delete newSale.id

  for(let key in newSale) {
    if(newSale[key] == '') {
      delete newSale[key]
    }
  }

  async.series([
    function(callback) {
      Sale.edit(req.params.cloudID, newSale, req.user.username, MDate.getDateTime(), callback)
    }
  ], function(err, data) {
    if(data[0] == true) {
      req.flash('success_msg', 'Successfully Edited')
      res.redirect('/sale/edit?cloudID=' + req.params.cloudID)
      return
    } else {
      req.flash('error', 'Error occured')
      res.redirect('/sale/edit?cloudID=' + req.params.cloudID)
      return
    }
  })

})

router.get('/verify/:cloudID', Auth.salesSearchAllowed, function(req, res) {
  async.series([
    function(callback) {
      Sale.verify(req.params.cloudID, req.user.username, MDate.getDateTime(), callback)
    }
  ], function(err, data) {
    if(data[0] == true) {
      request('https://cpsolutions.dialog.lk/api/sms/inline/send.php?destination=' + '94768237192,94703524280,94703524285,94703524290' + '&q=' + args.textAPIKey + '&message=' + 'Sale ' + req.params.cloudID + ' has been verified', { json: true }, function (err, res2, body) {
        res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
      })
    } else {
      res.send('Error')
    }
  })
})

router.get('/dscomplete/:cloudID', Auth.salesSearchAllowed, function(req, res) {
  async.series([
    function(callback) {
      Sale.dsComplete(req.params.cloudID, req.user.username, MDate.getDateTime(), callback)
    }
  ], function(err, data) {
    if(data[0] == true) {
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
    } else {
      console.log(err)
      res.send('Error')
    }
  })
})

router.get('/senttormv/:cloudID', Auth.salesSearchAllowed, function(req, res) {
  async.series([
    function(callback) {
      Sale.rmvSent(req.params.cloudID, req.user.username, MDate.getDateTime(), callback)
    }
  ], function(err, data) {
    if(data[0] == true) {
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
    } else {
      console.log(err)
      res.send('Error')
    }
  })
})

router.post('/crhandover/:cloudID', Auth.salesSearchAllowed, function(req, res) {
  const reg_update = {
    cr_handed_over: 1,
    pronto_number: req.body.pronto_number,
    pronto_date: req.body.pronto_date,
    hand_over_person_responsible: req.body.responsible,
    hand_over_remarks: req.body.remarks,
    hand_over_added_on: MDate.getDateTime(),
    hand_over_added_by: req.user.username
  }

  Sale.addRegistration(req.params.cloudID, reg_update, function(err, data) {
    if(err) {
      req.flash('warning_msg', 'Failed to add hand over')
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
      return
    }
    res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
    return
  })
})

router.post('/customerconfirmation/:cloudID', Auth.salesSearchAllowed, function(req, res) {
  const reg_update = {
    customer_confirmation: 1,
    customer_remarks: req.body.remarks,
    confirmation_added_on: MDate.getDateTime(),
    confirmation_added_by: req.user.username
  }

  Sale.addRegistration(req.params.cloudID, reg_update, function(err, data) {
    if(err) {
      req.flash('warning_msg', 'Failed to add confirmation')
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
      return
    }
    res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
    return
  })
})

router.post('/registration/:cloudID', multipart, Auth.salesSearchAllowed, function(req, res) {
  if(req.files.attachment.originalFilename == '') {
    req.flash('warning_msg', 'CR Missing')
    res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
    return
  }

  async.series([
    function(callback) {
      Cloudinary.upload(req.files.attachment.path, callback)
    }
  ], function(err, uploadData) {
    if(uploadData[0].error) {
      req.flash('warning_msg', 'Something went wrong while uploading the file')
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
      return
    }

    const reg_update = {
      registered: 1,
      registered_date: req.body.date,
      registered_number: req.body.number,
      cr: uploadData[0].url,
      registered_added_on: MDate.getDateTime(),
      registered_added_by: req.user.username
    }

    Sale.addRegistration(req.params.cloudID, reg_update, function(err, data) {
      if(err) {
        req.flash('warning_msg', 'Failed to add registration')
        res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
        return
      }
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
      return
    })
  })
})

router.post('/addComment/:cloudID', multipart, Auth.salesSearchAllowed, function(req, res) {


    if(req.body.comment == '') {
      req.flash('warning_msg', 'Enter a comment')
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
      return
    }

    if(req.files.attachment.originalFilename == '') {
      const comment = {
        sale_id: req.params.cloudID,
        username: req.user.username,
        date: MDate.getDateTime(),
        text: req.body.comment
      }

      async.series([
        function(callback) {
          Sale.addComment(comment, callback)
        }
      ], function(err, data) {
        if(data[0] == true) {

          const notification = {
            title: req.user.username + ' commented on sale ' + req.params.cloudID,
            link: '/sale/cloudIDInfo?cloudID=' + req.params.cloudID,
            user: req.user.username,
            datetime: MDate.getDateTime()
          }

          async.series([
            function(callback) {
              Sale.getCommentNotifiers(callback)
            }, function(callback) {
              Notification.create(notification, callback)
            }
          ], function(err, data) {

            const commentNotifiers = data[0]
            const notificationID = data[1]

            let commentUserNotifications = []

            for(let i = 0; i < commentNotifiers.length; i++) {
              if(req.user.username != commentNotifiers[i]['username']) {
                commentUserNotifications.push([notificationID, commentNotifiers[i]['username']])
              }
            }

            async.series([
              function(callback) {
                Notification.createUserNotifications(commentUserNotifications, callback)
              }
            ], function(err, data) {
              res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
            })
          })
        } else {
          res.send('Error')
        }
      })
    } else {
      const attachmentExtension = req.files.attachment.originalFilename.split('.').pop().toLowerCase()

      if(attachmentExtension == 'jpg' || attachmentExtension == 'jpeg' || attachmentExtension == 'png' || attachmentExtension == 'JPG' || attachmentExtension == 'JPEG' || attachmentExtension == 'PNG') {
        async.series([
          function(callback) {
            Cloudinary.upload(req.files.attachment.path, callback)
          }
        ], function(err, uploadData) {

          if(uploadData[0].error) {
            req.flash('warning_msg', 'Something went wrong while uploading the file')
            res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
            return
          }

          const comment = {
            sale_id: req.params.cloudID,
            username: req.user.username,
            date: MDate.getDateTime(),
            text: req.body.comment,
            attachment: uploadData[0].url
          }

          async.series([
            function(callback) {
              Sale.addComment(comment, callback)
            }
          ], function(err, data) {
            if(data[0] == true) {

              const notification = {
                title: req.user.username + ' commented on sale ' + req.params.cloudID,
                link: '/sale/cloudIDInfo?cloudID=' + req.params.cloudID,
                user: req.user.username,
                datetime: MDate.getDateTime()
              }

              async.series([
                function(callback) {
                  Sale.getCommentNotifiers(callback)
                }, function(callback) {
                  Notification.create(notification, callback)
                }
              ], function(err, data) {

                const commentNotifiers = data[0]
                const notificationID = data[1]

                let commentUserNotifications = []

                for(let i = 0; i < commentNotifiers.length; i++) {
                  if(req.user.username != commentNotifiers[i]['username']) {
                    commentUserNotifications.push([notificationID, commentNotifiers[i]['username']])
                  }
                }

                async.series([
                  function(callback) {
                    Notification.createUserNotifications(commentUserNotifications, callback)
                  }
                ], function(err, data) {
                  res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
                })
              })
            } else {
              res.send('Error')
            }
          })
        })
      } else {
          req.flash('warning_msg', 'Allowed file types are jpg jpeg and png')
          res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
      }

    }

})

router.get('/searchByCloudId', Auth.salesSearchAllowed, function(req, res) {
  async.series([
    function(callback) {
      Sale.searchByCloudId(req.query.cloudID, callback)
    }
  ], function(err, details) {
    res.render('sale/searchByCloudID', {
      navbar: 'Sales',
      title: 'Info By Cloud ID',
      user: req.user,
      sales: details[0],
      results: details[0].length,
    })
  })
})

router.get('/searchByChassisNo', Auth.salesSearchAllowed, function(req, res) {
  async.series([
    function(callback) {
      Sale.searchByChassisNo(req.query.chassisNo, callback)
    }
  ], function(err, details) {
    res.render('sale/searchByChassisNo', {
      navbar: 'Sales',
      title: 'Info By Chassis No',
      user: req.user,
      sales: details[0],
      results: details[0].length,
    })
  })
})

router.get('/cloudIDInfo', Auth.salesSearchAllowed, function(req, res) {
  async.series([
    function(callback) {
      Sale.cloudIDInfo(req.query.cloudID, callback)
    }, function(callback) {
      Sale.getComments(req.query.cloudID, callback)
    }, function(callback) {
      Sale.saleCompletedTypes(callback)
    }, function(callback) {
      Sale.getWatches(req.query.cloudID, callback)
    }, function(callback) {
      Sale.getRMVDetails(req.query.cloudID, callback)
    }
  ], function(err, details) {
    res.render('sale/cloudIDInfo', {
      navbar: 'Sales',
      title: 'Sale Info',
      user: req.user,
      sales: details[0],
      comments: details[1],
      saleCompletedTypes: details[2],
      watches: details[3],
      rmvDetails: details[4]
    })
  })
})

router.post('/commisionPaid/:cloudID', function(req, res) {
    const markComplete = {
      commision_paid: 1,
      commission_paid_remarks: req.body.details,
      commission_paid_marked_by: req.user.username,
      commission_paid_marked_on: MDate.getDateTime()
    }

    async.series([
      function(callback) {
        Sale.markComplete(markComplete, req.params.cloudID, callback)
      }
    ], function(err, data) {
      if(data[0] == true) {
        res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
      } else {
        req.flash('warning_msg', 'Error occurred')
        res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
      }
    })
})

router.post('/markComplete/:cloudID', Auth.salesSearchAllowed, function(req, res) {
  const markComplete = {
    sale_completed: 1,
    sale_completed_type_id: req.body.sale_completed_type,
    sale_completed_remarks: req.body.details,
    sale_completed_by: req.user.username,
    sale_completed_on: MDate.getDateTime()
  }

  async.series([
    function(callback) {
      Sale.markComplete(markComplete, req.params.cloudID, callback)
    }
  ], function(err, data) {
    if(data[0] == true) {
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
    } else {
      req.flash('warning_msg', 'Error occurred')
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.cloudID)
    }
  })

})

router.get('/search', Auth.salesSearchAllowed, function(req, res) {
  async.series([
    function(callback) {
      Sale.search(req.query.skw, callback)
    }
  ], function(err, details) {
    res.render('sale/search', {
      navbar: 'Sales',
      title: 'Sale Search',
      user: req.user,
      sales: details[0],
      skw: req.query.skw,
      modelSummary: SalesFunctions.modelSummary(details[0]),
      modelGroupSummary: SalesFunctions.modelGroupSummary(details[0]),
      dealerSummary: SalesFunctions.dealerSalesSummary(details[0]),
    })
  })
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

router.get('/range/all/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByRangeAll(req.query.startDate, req.query.endDate, callback)
        }
    ], function(err, details) {
        res.render('sale/by_range/all', {
            url: req.url,
            navbar: 'Search Results',
            title: 'Search Sales By Date Range',
            user: req.user,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            modelGroupSummary: SalesFunctions.modelGroupSummary(details[0]),
            dealerSummary: SalesFunctions.dealerSalesSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/range/all/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByRangeAll(req.query.startDate, req.query.endDate, callback)
        }
    ], function(err, details) {
        res.xls('All '+req.query.startDate + req.query.endDate+' Sys.xlsx', details[0])
    })
})

router.get('/range/region/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByRangeRegion(req.query.startDate, req.query.endDate, req.query.region, callback)
        }
    ], function(err, details) {
        res.render('sale/by_range/region', {
            url: req.url,
            navbar: 'Search Results',
            title: 'Search Sales By Region',
            user: req.user,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            region: req.query.region,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            modelGroupSummary: SalesFunctions.modelGroupSummary(details[0]),
            dealerSummary: SalesFunctions.dealerSalesSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/range/region/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByRangeRegion(req.query.startDate, req.query.endDate, req.query.region, callback)
        }
    ], function(err, details) {
        res.xls('Region '+req.query.region+' '+req.query.startDate+req.query.endDate+' Sys.xlsx', details[0])
    })
})

router.get('/range/officer/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByRangeOfficer(req.query.startDate, req.query.endDate, req.query.officer, callback)
        }
    ], function(err, details) {
        res.render('sale/by_range/officer', {
            url: req.url,
            navbar: 'Search Results',
            title: 'Search Sales By Officer',
            user: req.user,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            officer: req.query.officer,
            sales: details[0],
            modelSummary: SalesFunctions.modelSummary(details[0]),
            modelGroupSummary: SalesFunctions.modelGroupSummary(details[0]),
            dealerSummary: SalesFunctions.dealerSalesSummary(details[0]),
            results: details[0].length
        })
    })
})

router.get('/excel/range/officer/sysdate', function(req, res) {
    async.series([
        function(callback) {
            Sale.sysByRangeOfficer(req.query.startDate, req.query.endDate, req.query.officer, callback)
        }
    ], function(err, details) {
        res.xls('Officer '+req.query.officer+' '+req.query.startDate+req.query.endDate+' Sys.xlsx', details[0])
    })
})

router.post('/addWatch/:saleID', multipart, (req, res) => {
  const { content, due_date } = req.body;
  const { saleID } = req.params;

  const sale_watch = {
    sale_id: saleID,
    content,
    date: MDate.getDateTime(),
    due_date,
    user: req.user.username
  }

  async.series([
    function(callback) {
      Sale.addWatch(sale_watch, callback)
    }
  ], function(err, data) {
    const watchAdded = data[0]

    if(watchAdded) {
      res.redirect('/sale/cloudIDInfo?cloudID=' + saleID)
    } else {
      req.flash('warning_msg', 'Failed to add watch')
      res.redirect('/sale/cloudIDInfo?cloudID=' + saleID)
    }
  })
});

router.get('/watchSucceeded/:saleID/:watchID', (req, res) => {
  async.series([
    function(callback) {
      Sale.watchSucceeded(req.params.watchID, req.user.username, callback)
    }
  ], function(err, closed) {
    if(closed) {
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.saleID)
    } else {
      req.flash('warning_msg', 'Failed to close watch')
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.saleID)
    }
  })
})

router.get('/watchFailed/:saleID/:watchID', (req, res) => {
  async.series([
    function(callback) {
      Sale.watchFailed(req.params.watchID, req.user.username, callback)
    }
  ], function(err, closed) {
    if(closed) {
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.saleID)
    } else {
      req.flash('warning_msg', 'Failed to close watch')
      res.redirect('/sale/cloudIDInfo?cloudID=' + req.params.saleID)
    }
  })
})

module.exports = router
