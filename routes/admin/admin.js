const express = require('express')
const async = require('async')
const Cloudinary = require('../../models/comms/cloudinary')
const multiparty = require('connect-multiparty')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const Admin = require('../../models/admin/admin')
const Region = require('../../models/region/region')

const Validator = require('../../functions/validator')

const args = require('yargs').argv

const multipart = multiparty()

router.use(Auth.signedIn, Auth.validAdminUser, function(req, res, next) {
    const log = {
        username: req.user.username,
        url: req.url,
        date: MDate.getDateTime(),
        method: req.method
    }
    async.series([
        function(callback) {
            Admin.addLog(log, callback)
        }
    ], function(err, data) {
        if(data[0] == true) {
            next()
        } else {
            res.redirect('/')
            return
        }
    })
})

router.get('/allUsers', function(req, res) {
    async.series([
        function(callback) {
            Admin.allUsers(callback)
        }
    ], function(err, data) {
        res.render('admin/allUser', {
            title: 'All Users',
            navbar: 'Admin',
            users: data[0],
            user: req.user
        })
    })
})

router.get('/currentlyEmployed', function(req, res) {
    async.series([
        function(callback) {
            Admin.currentlyEmployedUsers(callback)
        }
    ], function(err, data) {
        res.render('admin/currentlyEmployed', {
            title: 'Currently Employed',
            url: req.url,
            navbar: 'Admin',
            users: data[0],
            user: req.user
        })
    })
})

router.get('/excel/currentlyEmployed', function(req, res) {
    async.series([
        function(callback) {
            Admin.currentlyEmployedUsers(callback)
        }
    ], function(err, data) {
        res.xls('Currently Employed.xlsx', data[0])
    })
})

router.get('/addUser', function(req, res) {
    async.series([
        function(callback) {
            Region.getAllRegions(callback)
        }, function(callback) {
            Region.getAllTerritories(callback)
        }, function(callback) {
            Admin.allDesignations(callback)
        }
    ], function(err, data) {
        res.render('admin/addUser', {
            title: 'Add User',
            navbar: 'Admin',
            regions: data[0],
            territories: data[1],
            user: req.user,
            designations: data[2]
        })
    })
})

router.post('/addUser', multipart, function(req, res) {

    if(req.body.first_name == '' || req.body.last_name == '' || req.body.common_name == '' || req.body.display_name == '' || req.body.email == '' || req.body.birthday == '' || req.body.designation == '' || req.files.application_form.originalFilename == '' || Validator.validEmail(req.body.email) == false || req.body.common_name.indexOf(' ') >= 0) {
        req.flash('warning_msg', 'Validation Errors')
        res.redirect('/admin/addUser')
        return
    }

    const password = Math.random().toString(36).substring(7)
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    let user = {
        username: req.body.common_name + '.' + req.body.first_name.substring(0, 1).toLowerCase() + req.body.last_name.substring(0, 1).toLowerCase(),
        password: hash,
        email: req.body.email,
        active: 1,
        login_enabled: req.body.login_enabled,
        name: req.body.display_name,
        region: req.body.region,
        territory: req.body.territory,
        profile_pic: 'https://res.cloudinary.com/randeepa-com/image/upload/v1532593842/jo7zcyh1shgq1jhifuub.png',
        birthday: req.body.birthday,
        designation: req.body.designation,
        designation_fk: req.body.designation_fk,
        profile: req.body.profile,
        change_password: 1
    }

    async.series([
        function(callback) {
            Cloudinary.upload(req.files.application_form.path, callback)
        }
    ], function(err, data) {

        if(data[0].error) {
            req.flash('warning_msg', 'Check image format')
            res.redirect('/admin/addUser')
            return
        }

        user['application_form'] = data[0].url

        async.series([
            function(callback) {
                Admin.addUser(user, callback)
            }
        ], function(err, data) {
            if(data[0] == true) {

                if(req.body.login_enabled == 0) {
                    req.flash('warning_msg', 'Account successfully created.')
                    res.redirect('/admin/allUsers')
                    return
                } else {
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.zoho.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'admin@randeepa.cloud',
                            pass: args.adminEmailPassword
                        }
                    })

                    const message = '<p>Dear ' + req.body.first_name + ' ' + req.body.last_name + ', <br> Your Randeepa Cloud account details are as follows, <br> Username - ' + user.username + ' <br> Password - ' + password + ' <br> Please use the link, https://www.randeepa.cloud to access the cloud.<br> You will be asked to change your password at first login. Please note that unathorized use of this credentials described in the employment agreement may lead to disciplinary action and or termination. <br> Thank You,<br>Randeepa Cloud Team</p>'

                    const mailOptions = {
                        from: 'Randeepa Cloud <admin@randeepa.cloud>',
                        to: req.body.email+',shamal@randeepa.com',
                        subject: 'Welcome to Randeepa, '+ req.body.first_name + '. Your Randeepa Cloud account is ready',
                        html: message
                    }

                    async.series([
                        function(callback) {
                            transporter.sendMail(mailOptions, callback)
                        }
                    ], function(err, data) {
                        if(err) {
                            req.flash('warning_msg', 'Account created. But an internal error occured. Please contact administrator to fix the issue')
                            res.redirect('/admin/allUsers')
                            return
                        } else {
                            req.flash('warning_msg', 'Account successfully created. Please check user email for login credentials')
                            res.redirect('/admin/allUsers')
                            return
                        }
                    })
                }

            }
        })
    })
})

router.get('/setAccess', function(req, res) {
    async.series([
        function(callback) {
            Admin.allModules(callback)
        }, function(callback) {
            Admin.availableModulesChart(callback)
        }
    ], function(err, data) {
        res.render('admin/setAccess', {
            title: 'Set Access',
            navbar: 'Admin',
            modules: data[0],
            userId: req.query.userId,
            user: req.user,
            modulesInfo: data[1]
        })
    })
})

router.post('/setAccess', function(req, res) {
    async.series([
        function(callback) {
            Admin.userAvailableModules(req.body.userId, callback)
        }
    ], function(err, data) {
        if(data[0][0]['available_modules'] != 0) {
            res.send("<br><div class='alert alert-warning'>User access already set</div>")
        } else {

            const modules = req.body.module
            const moduleValues = req.body.moduleValue

            let accessModules = []

            if(modules.constructor === Array) {
                for(let i = 0; i < modules.length; i++) {
                    accessModules.push([req.body.userId, modules[i], moduleValues[i]])
                }
            } else {
                accessModules.push([req.body.userId, modules, moduleValues])
            }

            async.series([
                function(callback) {
                    Admin.setAccessLevel(accessModules, callback)
                }
            ], function(err, data) {
                if(err) {
                    res.send("<br><div class='alert alert-warning'>Error</div>")
                } else {
                    res.send("<br><div class='alert alert-success'>Access successfully set</div>")
                }
            })
        }
    })
})

router.get('/editUser', function(req, res) {
    // region territory designation profile

    async.series([
        function(callback) {
            Region.getAllRegions(callback)
        }, function(callback) {
            Region.getAllTerritories(callback)
        }, function(callback) {
            Admin.userDetails(req.query.userId, callback)
        }, function(callback) {
            Admin.allDesignations(callback)
        }
    ], function(err, data) {
        res.render('admin/editUser', {
            title: 'Edit User',
            navbar: 'Admin',
            userId: req.query.userId,
            user: req.user,
            regions: data[0],
            territories: data[1],
            userDetails: data[2],
            designations: data[3]
        })
    })
})

router.get('/activeUsers', function(req, res) {
  res.render('admin/activeUsers', {
    title: 'Active Users',
    navbar: 'Admin',
    user: req.user
  })
})

router.post('/editUser', function(req, res) {

    let reqBody = req.body;

    if(reqBody.birthday == "") {
        reqBody.birthday = null
    }

    async.series([
        function(callback) {
            Admin.udpateUserDetails(req.query.userId, reqBody, callback)
        }
    ], function(err, data) {
        if(err) {
            req.flash('warning_msg', 'Error')
            res.redirect('/admin/editUser?userId=' + req.query.userId)
            return
        } else {
            req.flash('warning_msg', 'User successfully edited')
            res.redirect('/admin/editUser?userId=' + req.query.userId)
            return
        }
    })
})

router.post('/editUserProfilePicture', multipart, function(req, res) {
    async.series([
        function(callback) {
            Cloudinary.upload(req.files.profile_pic.path, callback)
        }
    ], function(err, data) {
        if(data[0].error) {
            req.flash('warning_msg', 'Image issue')
            res.redirect('/admin/editUser?userId=' + req.query.userId)
            return
        }

        async.series([
            function(callback) {
                Admin.updateUserProfilePicture(req.query.userId, "https" + data[0].url.substring(4), callback)
            }
        ], function(err, data) {
            if(err) {
                req.flash('warning_msg', 'Error occured')
                res.redirect('/admin/editUser?userId=' + req.query.userId)
                return
            } else {
                req.flash('warning_msg', 'Profile picture successfully updated')
                res.redirect('/admin/editUser?userId=' + req.query.userId)
                return
            }
        })

    })
})

module.exports = router
