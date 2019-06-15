const express = require('express')
const async = require('async')

const router = express.Router()

const Auth = require('../../functions/auth')
const MDate = require('../../functions/mdate')

const Service = require('../../models/service/service')

router.use(Auth.signedIn, Auth.validServiceUser, function(req, res, next) {
    next()
})

router.get('/hello', function(req, res) {

})

module.exports = router
