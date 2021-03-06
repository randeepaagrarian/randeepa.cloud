const MySql = require('../comms/mySqlCon')
const Driver = module.exports = {}

const MDate = require('../../functions/mdate')

Driver.add = function(driver, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO driver SET ?', driver, function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Driver.getAll = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM driver', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Driver.monthlyRoutes = function(driver_id, year, month, callback) {

    const daysInMonth = MDate.getDaysInMonth(month, year)

    const firstDate = year + '-' + month + '-01 00:00:00'
    const secondDate = year + '-' + month + '-' + daysInMonth + ' 23:59:59'

    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT id, vehicle_number, DATE_FORMAT(route_start_time, \'%Y-%m-%d\') AS route_start_time, DATE_FORMAT(route_end_time, \'%Y-%m-%d %H:%i:%S\') AS route_end_time, start_meter, end_meter, start_location, end_location, DATE_FORMAT(sys_time, \'%Y-%m-%d %H:%i:%S\') AS sys_time, (end_meter - start_meter) AS mileage FROM route WHERE driver_id = ? AND route_start_time BETWEEN ? AND ? ORDER BY route_start_time;', [driver_id, firstDate, secondDate], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Driver.calculateSummary = function(year, month, routes, callback) {
    err = null
    let total = 0
    let routeItems = routes.length
    for(let i = 0; i < routeItems; i++) {
        total = total + parseInt(routes[i]['mileage'])
    }

    if(!(year < 2018) && (year >= 2018 && month > 4)) {
        const summary = {
            total: total,
            overKM: total - 2500,
            overKMPayment: (total - 2500) * 3
        }

        callback(err, summary)
    } else {
        const summary = {
            total: total,
            overKM: total - 3500,
            overKMPayment: (total - 3500) * 3
        }

        callback(err, summary)
    }
}

Driver.getDetails = function(driver, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM driver WHERE id = ?', driver, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
