const MySql = require('../comms/mySqlCon')
const User = module.exports = {}

User.getUserByUsername = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        connection.release()
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM user WHERE username = ?', username, function(err, rows, fields) {
            if(err) {
                return callback(err, null)
            } else {
                if(rows.length == 1)
                    return callback(err, rows[0])
                else
                    callback(err, false)
            }
        })
    })
}

User.accountRecovery = function(username, password, passwordResetRequestDate, passwordResetRequestIP, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('UPDATE user SET password = ?, change_password = 1, password_reset_request_date = ?, password_reset_request_ip = ? WHERE username = ?', [password, passwordResetRequestDate, passwordResetRequestIP, username], function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

User.getActiveUsers = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT username as id, name, active FROM user WHERE active = 1', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

User.getAllUsers = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT username as id, name FROM user', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

User.getUserById = function(id, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        connection.release()
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM user WHERE id = ?', id, function(err, rows, fields) {
            if(err) {
                return callback(err, null)
            } else {
                User.getAccessLayers(id, function(err, access_layers) {
                    let user = rows[0]
                    user['accessLevel'] = {}

                    for(let i = 0; i < access_layers.length; i++) {
                        user['accessLevel'][access_layers[i]['name']] = access_layers[i]['access_level']
                    }

                    callback(err, user)
                })
            }
        })
    })
}

User.changePassword = function(username, datetime, password, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('UPDATE user SET password = ?, change_password = 0, last_password_change = ? WHERE username = ?', [password, datetime, username], function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

User.getAccessLayers = function(id, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        connection.release()
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT name, access_level FROM user_access LEFT JOIN access_layer ON user_access.access_layer_id = access_layer.id WHERE user_id = ?', id, function(err, rows, fields) {
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}
