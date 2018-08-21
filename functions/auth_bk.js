const Auth = module.exports = {}

Auth.signedIn = function(req, res, next) {
    if(req.user) {
        next()
    } else {
        res.redirect('/signin')
    }
}

Auth.validRouteDashboardUser = function(req, res, next) {
    if(req.user.accessLevel.routes) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validDriverRouteUser = function(req, res, next) {
    if(req.user.accessLevel.routes) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validBankingDashboardUser = function(req, res, next) {
    if(req.user.accessLevel.banking) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validBankingUser = function(req, res, next) {
    if(req.user.accessLevel.banking == 8) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validBankingAreaProfileUser = function(req, res, next) {
    if(req.user.accessLevel.banking == 9) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validBankingMyProfileUser = function(req, res, next) {
    if(req.user.accessLevel.banking == 10) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validSaleDashboardUser = function(req, res, next) {
    if(req.user.accessLevel.sale) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validSaleUser = function(req, res, next) {
    if(req.user.accessLevel.sale == 8) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validSaleAreaProfileUser = function(req, res, next) {
    if(req.user.accessLevel.sale == 9) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validSaleMyProfileUser = function(req, res, next) {
    if(req.user.accessLevel.sale == 10) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validCollectionDashboardUser = function(req, res, next) {
    if(req.user.accessLevel.collection) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validCollectionEditUser = function(req, res, next) {
    if(req.user.accessLevel.collection < 10) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validCollectionViewUser = function(req, res, next) {
    if(req.user.accessLevel.collection <= 10) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validVisitDashboardUser = function(req, res, next) {
    if(req.user.accessLevel.visits) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validVisitUser = function(req, res, next) {
    if(req.user.accessLevel.visits == 8) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validVisitAreaProfileUser = function(req, res, next) {
    if(req.user.accessLevel.visits == 9) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validVisitMyProfileUser = function(req, res, next) {
    if(req.user.accessLevel.visits == 10) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validStockDashboardUser = function(req, res, next) {
    if(req.user.accessLevel.stock) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validStockUser = function(req, res, next) {
    if(req.user.accessLevel.stock == 8) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.isValidSparePartDashboardUser = function(req, res, next) {
    if(req.user.accessLevel.sparePart) {
        next()
    } else {
        res.redirect('/')
    }
}

Auth.validSparePartUser = function(req, res, next) {
    if(req.user.accessLevel.sparePart == 8) {
        next()
    } else {
        res.redirect('/')
    }
}
