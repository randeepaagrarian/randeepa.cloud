const MySql = require('../comms/mySqlCon')
const MDate = require('../../functions/mdate')
const Admin = module.exports = {}

Admin.addLog = function(log, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO admin_logs SET ?', [log], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Admin.allUsers = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select user.id, username, email, user.active, user.login_enabled, user.name, region.name as region, territory.name as territory, profile_pic, DATE_FORMAT(birthday, \'%Y-%m-%d\') as birthday, designation.name as designation, profile, COUNT(user_access.user_id) as active_modules from user left join region on user.region = region.id left join territory on user.territory = territory.id left join user_access on user.id = user_access.user_id left join designation on user.designation_fk = designation.id group by user.id, username, email, user.active, user.name, region, territory, profile_pic, birthday, designation, profile', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Admin.allUsersByRegion = function(region, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select user.id, username, email, user.active, user.name, region.name as region, territory.name as territory, profile_pic, DATE_FORMAT(birthday, \'%Y-%m-%d\') as birthday, designation, profile, COUNT(user_access.user_id) as active_modules from user left join region on user.region = region.id left join territory on user.territory = territory.id left join user_access on user.id = user_access.user_id where region = ? group by user.id, username, email, user.active, user.name, region, territory, profile_pic, birthday, designation, profile', region, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Admin.allDesignations = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM designation', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Admin.addUser = function(user, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO user SET ?', user, function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Admin.allModules = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select * from access_layer', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Admin.userAvailableModules = function(userId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select count(user_id) as available_modules from user_access where user_id = ?', [userId], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Admin.setAccessLevel = function(accessLevel, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO user_access VALUES ?', [accessLevel], function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Admin.userDetails = function(userId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select username, email, user.active, user.login_enabled, user.name, region, territory, profile_pic, birthday, designation, designation_fk, profile, region.name as region_name, territory.name as territory_name from user left join region on user.region = region.id left join territory on user.territory = territory.id where user.id = ?', userId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Admin.userDetailsByUsername = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select username, email, user.active, user.name, region, territory, profile_pic, birthday, designation, profile, region.name as region_name, territory.name as territory_name from user left join region on user.region = region.id left join territory on user.territory = territory.id where user.username = ?', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Admin.udpateUserDetails = function(userId, updatedUser, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('UPDATE user SET ? where id = ?', [updatedUser, userId], function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Admin.updateUserProfilePicture = function(userId, profilePicture, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('UPDATE user SET profile_pic = ? where id = ?', [profilePicture, userId], function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Admin.availableModulesChart = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select al.name as module_name, alv.value, alv.name as access_name from access_layer al, access_layer_values alv where al.id = alv.access_layer_id', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
