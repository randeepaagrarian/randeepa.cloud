const MySql = require('../comms/mySqlCon')
const Notification = module.exports = {}

Notification.create = function(notification, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('INSERT INTO notification SET ?', notification, function(err, results, fields) {
        connection.release()
        if(err) {
            return callback(err, false)
        }
        callback(err, results.insertId)
    })
  })
}

Notification.createUserNotifications = function(userNotifications, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('INSERT INTO user_notification (notification_id, user) VALUES ?', [userNotifications], function(err, results, fields) {
        connection.release()
        if(err) {
            return callback(err, false)
        }
        callback(err, true)
    })
  })
}

Notification.getUserNotifications = function(user, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('SELECT user_notification.id, link, title, datetime, checked FROM user_notification LEFT JOIN notification ON notification_id = notification.id WHERE user_notification.user = ? ORDER BY datetime DESC LIMIT 100', user, function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, null)
        }
        callback(err, rows)
    })
  })
}

Notification.getAllUserNotifications = function(user, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('SELECT user_notification.id, link, title, datetime, checked FROM user_notification LEFT JOIN notification ON notification_id = notification.id WHERE user_notification.user = ? ORDER BY datetime DESC', user, function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, null)
        }
        callback(err, rows)
    })
  })
}

Notification.getUnreadUserNotifications = function(user, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('SELECT user_notification.id, link, title, datetime FROM user_notification LEFT JOIN notification ON notification_id = notification.id WHERE checked = 0 AND user_notification.user = ? ORDER BY datetime DESC', user, function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, null)
        }
        callback(err, rows)
    })
  })
}

Notification.getUserNotificationDetails = function(notification_id, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('SELECT N.link, UN.user FROM user_notification UN LEFT JOIN notification N ON UN.notification_id = N.id where UN.id = ?', notification_id, function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, null)
        }
        callback(err, rows)
    })
  })
}

Notification.markChecked = function(notification_id, date, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('UPDATE user_notification SET checked = 1, read_on = ? WHERE id = ?', [date, notification_id], function(err, results, fields) {
        connection.release()
        if(err) {
            return callback(err, false)
        }
        callback(err, true)
    })
  })
}

Notification.markUnread = function(notification_id, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('UPDATE user_notification SET checked = 0, read_on = NULL WHERE id = ?', [notification_id], function(err, results, fields) {
        connection.release()
        if(err) {
            return callback(err, false)
        }
        callback(err, true)
    })
  })
}

Notification.clearAll = function(user, datetime, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('UPDATE user_notification SET checked = 1, read_on = ? WHERE user = ? AND checked = 0', [datetime, user], function(err, results, fields) {
        connection.release()
        if(err) {
            return callback(err, false)
        }
        callback(err, true)
    })
  })
}
