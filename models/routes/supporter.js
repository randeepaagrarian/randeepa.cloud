const MySql = require('../comms/mySqlCon')
const Supporter = module.exports = {}

const MDate = require('../../functions/mdate')

Supporter.add = function(driver, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO supporter SET ?', driver, function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Supporter.getAll = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM supporter', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Supporter.monthlyRoutes = function(supporter_id, year, month, callback) {

    const daysInMonth = MDate.getDaysInMonth(year, month)

    const firstDate = year + '-' + month + '-01 00:00:00'
    const secondDate = year + '-' + month + '-' + daysInMonth + ' 23:59:59'

    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT id, vehicle_number, DATE_FORMAT(route_start_time, \'%Y-%m-%d\') AS route_start_time, DATE_FORMAT(route_end_time, \'%Y-%m-%d %H:%i:%S\') AS route_end_time, start_meter, end_meter, start_location, end_location, DATE_FORMAT(sys_time, \'%Y-%m-%d %H:%i:%S\') AS sys_time, (end_meter - start_meter) AS mileage FROM route WHERE supporter_id = ? AND route_start_time BETWEEN ? AND ? ORDER BY route_start_time;', [supporter_id, firstDate, secondDate], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Supporter.calculateSummary = function(year, month, routes, callback) {
    err = null
    var total = 0
    var routeItems = routes.length
    for(var i = 0; i < routeItems; i++) {
        total = total + parseInt(routes[i]['mileage'])
    }

    if(!(year < 2018) && (year >= 2018 && month > 4)) {
        const summary = {
            total: total,
            overKM: total - 2500,
            overKMPayment: (total - 2500) * 1.5
        }

        callback(err, summary)
    } else {
        const summary = {
            total: total,
            overKM: total - 3500,
            overKMPayment: (total - 3500) * 1
        }

        callback(err, summary)
    }
}

Supporter.getDetails = function(supporter_id, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM supporter WHERE id = ?', supporter_id, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
