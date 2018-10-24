const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const async = require('async')
const LocalStrategy = require('passport-local').Strategy

const router = express.Router()

const MDate = require('../functions/mdate')
const Auth = require('../functions/auth')

const User = require('../models/user/user')
const Region = require('../models/region/region')
const Driver = require('../models/routes/driver')
const Supporter = require('../models/routes/supporter')
const Sale = require('../models/dashboard/sale')
const Stock = require('../models/stock/stock')

const Default = require('../models/default')

router.get('/', Auth.signedIn, function(req, res) {

	async.series([
		function(callback) {
			Sale.topRegionsByMonth(new Date().getFullYear(), new Date().getMonth() + 1, callback)
		}, function(callback) {
			Sale.topOfficersByMonth(new Date().getFullYear(), new Date().getMonth() + 1, callback)
		}, function(callback) {
			Sale.byModelMonth(new Date().getFullYear(), new Date().getMonth() + 1, callback)
		}, function(callback) {
			Sale.byOfficerMonth(new Date().getFullYear(), new Date().getMonth() + 1, callback)
		}, function(callback) {
			Sale.lastYear(callback)
		}, function(callback) {
			Sale.lastYearCentral(callback)
		}, function(callback) {
			Sale.lastYearRajarata(callback)
		}, function(callback) {
			Sale.lastYearNorthWest(callback)
		}, function(callback) {
			Sale.lastYearRuhuna(callback)
		}, function(callback) {
			Sale.lastYearIndustrial(callback)
		}, function(callback) {
			Sale.lastYearNorth(callback)
		}
	], function(err, data) {
		res.render('dashboard_pro', {
			title: 'Dashboard',
			navbar: 'Dashboard',
			user: req.user,
			top_regions: data[0],
			top_officers: data[1],
			by_models: data[2],
			by_officers: data[3],
			last_year: data[4],
			last_year_central: data[5],
			last_year_rajarata: data[6],
			last_year_north_west: data[7],
			last_year_ruhuna: data[8],
			last_year_industrial: data[9],
			last_year_north: data[10],
			today: MDate.getDate('/')
		})
	})

})

router.get('/recovery', function(req, res) {
	res.render('recovery')
})

router.get('/sales', Auth.signedIn, Auth.validSaleDashboardUser, function(req, res) {
	async.series([
		function(callback) {
			Region.getAllRegions(callback)
		}, function(callback) {
			User.getActiveUsers(callback)
		}
	], function(err, data) {
		res.render('sales', {
			title: 'Sales',
			navbar: 'Sales',
			user: req.user,
			regions: data[0],
			users: data[1]
		})
	})
})

router.get('/bankings', Auth.signedIn, Auth.validBankingDashboardUser, function(req, res) {
	res.render('bankings', {
		title: 'Banking',
		navbar: 'Banking',
		user: req.user,
	})
})

router.get('/vehicle-routes', Auth.signedIn, Auth.validRouteDashboardUser, function(req, res) {
	async.series([
		function(callback) {
			Driver.getAll(callback)
		}, function(callback) {
			Supporter.getAll(callback)
		}
	], function(err, data) {
		res.render('routes', {
			title: 'Routes',
			navbar: 'Routes',
			drivers: data[0],
			supporters: data[1],
			user: req.user
		})
	})
})

router.get('/visits', Auth.signedIn, Auth.validVisitDashboardUser, function(req, res) {
	async.series([
		function(callback) {
			User.getActiveUsers(callback)
		}
	], function(err, data) {
		res.render('visits', {
			title: 'Visits',
			navbar: 'Visits',
			users: data[0],
			user: req.user
		})
	})
})

router.get('/stock', Auth.signedIn, Auth.validStockDashboardUser, function(req, res) {
	async.series([
		function(callback) {
			Stock.totalStock(callback)
		}, function(callback) {
			Stock.totalYardStock(callback)
		}, function(callback) {
			Stock.totalOutletStock(callback)
		}, function(callback) {
			Stock.totalDealerStock(callback)
		}, function(callback) {
			Stock.totalShowroomStock(callback)
		}, function(callback) {
			Stock.getRecentFivedeliveryDocuments(callback)
		}
	], function(err, data) {
		res.render('stock', {
			title: 'Stock',
			navbar: 'Stock',
			user: req.user,
			totalStocks: data[0],
			yardStocks: data[1],
			outletStocks: data[2],
			dealerStocks: data[3],
			showroomStocks: data[4],
			recentFivedeliveryDocuments: data[5]
		})
	})
})

router.get('/expense', Auth.signedIn, Auth.validExpenseDashboardUser, function(req, res) {
	res.render('expense', {
		title: 'Expenses',
		navbar: 'Expenses',
		user: req.user
	})
})

router.get('/admin', Auth.signedIn, Auth.validAdminUser, function(req, res) {
	res.render('admin', {
		title: 'Admin',
		navbar: 'Admin',
		user: req.user
	})
})

router.get('/signin', function(req, res) {
	if(req.user) {
		res.redirect('/')
	} else {
		async.series([
			function(callback) {
				Default.getBirthDays(callback)
			}
		], function(err, details) {
			res.render('signin', {
				title: 'Sign in',
				birthDays: details[0]
			})
		})
	}
})

router.get('/changePassword', Auth.signedIn, function(req, res) {
	res.render('changePassword', {
		title: 'Change Password',
		user: req.user
	})
})

router.post('/changePassword', Auth.signedIn, function(req, res) {
	if(req.body.password != req.body.confirm_password) {
		req.flash('error', 'Your passwords do not match')
		res.redirect('/changePassword')
		return
	}

	if(req.body.password.length < 8) {
		req.flash('error', 'Your password must contain at least 8 characters')
		res.redirect('/changePassword')
		return
	}

	if(req.body.password.search(/\d/) == -1) {
		req.flash('error', 'Your password must contain at least 1 digit')
		res.redirect('/changePassword')
		return
	}

	if(req.body.password.search(/[a-zA-Z]/) == -1) {
		req.flash('error', 'Your password cannot be all numbers')
		res.redirect('/changePassword')
		return
	}

	if(req.body.password.indexOf(req.user.username) != -1) {
		req.flash('error', 'Your password cannot contain your username')
		res.redirect('/changePassword')
		return
	}

	User.getUserByUsername(req.user.username, function(err, user) {
		if(err) {
			req.flash('error', 'System Error')
			res.redirect('/signout')
			return
		}

		if(bcrypt.compareSync(req.body.password, user.password)) {
			req.flash('error', 'Your password cannot be the current password')
			res.redirect('/changePassword')
			return
		}

		const salt = bcrypt.genSaltSync(10)
	    const hash = bcrypt.hashSync(req.body.password, salt)

		User.changePassword(req.user.username, MDate.getDateTime(), hash, function(err, data) {
			if(err) {
				req.flash('error', 'System Error')
				res.redirect('/signout')
				return
			}

			req.logout()

			req.flash('success_msg', 'Your password updated. Please sign in below')
			res.redirect('/signin')
		})
	})


})

router.get('/signout', function(req, res) {
	req.logout()

	req.flash('success_msg', 'You are successfully signed out')
	res.redirect('/signin')
})

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user){
			if(err) throw err

			if(user == false)
				return done(null, false, { message: 'Sorry! We can\'t seem to verify your username'})


			if(bcrypt.compareSync(password, user.password)) {
				if(user.active == 0)
					return done(null, false, { message: 'Sorr! Your account is suspended. Please contact administrator'})
				else
					return done(null, user)
			} else {
				return done(null, false, { message: 'Sorry! Your password doesn\'t match with your username'})
			}
		})
	}
))

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user)
  })
})

router.post('/signin', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/signin', failureFlash: true }))

module.exports = router
