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

router.post('/addUser', multipart, async (req, res) => {
    try {
        // Validate input
        const validationErrors = validateUserInput(req.body);
        if (validationErrors.length > 0) {
            req.flash('warning_msg', validationErrors.join(', '));
            return res.redirect('/admin/addUser');
        }

        // Generate password and hash
        const password = generateRandomPassword();
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Create user object
        const user = createUserObject(req.body, hash);

        // Add user to database
        const isUserAdded = await Admin.addUser(user);
        if (!isUserAdded) {
            throw new Error('Failed to add user to database');
        }

        // Send email notification (if enabled)
        // if (req.body.login_enabled == 1) {
        //     await sendEmailNotification(req.body, user.username, password);
        // }

        // Redirect with success message
        req.flash('warning_msg', `Account successfully created. Username - ${user.username} Password - ${password}`);
        res.redirect('/admin/allUsers');
    } catch (error) {
        console.error('Error in /addUser route:', error);
        req.flash('warning_msg', 'An error occurred. Please try again.');
        res.redirect('/admin/addUser');
    }
});

// Helper functions
function validateUserInput(body) {
    const errors = [];
    const requiredFields = ['first_name', 'last_name', 'common_name', 'display_name', 'email', 'birthday', 'designation'];
    requiredFields.forEach(field => {
        if (!body[field] || body[field].trim() === '') {
            errors.push(`${field} is required`);
        }
    });
    if (!Validator.validEmail(body.email)) {
        errors.push('Invalid email format');
    }
    if (body.common_name.indexOf(' ') >= 0) {
        errors.push('Common name cannot contain spaces');
    }
    return errors;
}

function generateRandomPassword() {
    return Math.random().toString(36).substring(7);
}

function createUserObject(body, passwordHash) {
    return {
        username: `${body.common_name}.${body.first_name.substring(0, 1).toLowerCase()}${body.last_name.substring(0, 1).toLowerCase()}`,
        password: passwordHash,
        email: body.email,
        active: 1,
        login_enabled: body.login_enabled,
        name: body.display_name,
        region: body.region,
        territory: body.territory,
        profile_pic: 'https://res.cloudinary.com/randeepa-com/image/upload/v1532593842/jo7zcyh1shgq1jhifuub.png',
        birthday: body.birthday,
        designation: body.designation,
        designation_fk: body.designation_fk,
        profile: body.profile,
        change_password: 1,
        application_form: 'no_application'
    };
}

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
