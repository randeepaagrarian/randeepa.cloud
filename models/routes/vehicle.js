const MySql = require('../comms/mySqlCon')
const Vehicle = module.exports = {}

const MDate = require('../../functions/mdate')

Vehicle.monthlyRoutes = function(vehicleid, year, month, callback) {

    const daysInMonth = MDate.getDaysInMonth(year, month)

    const firstDate = year + '-' + month + '-01 00:00:00'
    const secondDate = year + '-' + month + '-' + daysInMonth + ' 23:59:59'

    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT id, vehicle_number, DATE_FORMAT(route_start_time, \'%Y-%m-%d\') AS route_start_time, DATE_FORMAT(route_end_time, \'%Y-%m-%d %H:%i:%S\') AS route_end_time, start_meter, end_meter, start_location, end_location, DATE_FORMAT(sys_time, \'%Y-%m-%d %H:%i:%S\') AS sys_time, (end_meter - start_meter) AS mileage FROM route WHERE vehicle_number = ? AND route_start_time BETWEEN ? AND ? ORDER BY route_start_time;', [vehicleid, firstDate, secondDate], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Vehicle.calculateSummary = function(routes, callback) {
    err = null
    var total = 0
    var routeItems = routes.length
    for(var i = 0; i < routeItems; i++) {
        total = total + routes[i]['mileage']
    }

    const summary = {
        total: total
    }

    callback(err, summary)
}
