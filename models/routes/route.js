const MySql = require('../comms/mySqlCon')
const Route = module.exports = {}

Route.all = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT route.id, vehicle_number, driver.first_name AS driver_first_name, driver.last_name AS driver_last_name, supporter.first_name AS supporter_first_name, supporter.last_name AS supporter_last_name, source_documents, DATE_FORMAT(route_start_time, \'%Y-%m-%d %H:%i:%S\') AS route_start_time, DATE_FORMAT(route_end_time, \'%Y-%m-%d %H:%i:%S\') AS route_end_time, start_meter, end_meter, start_location, end_location, document_front, DATE_FORMAT(sys_time, \'%Y-%m-%d %H:%i:%S\') AS sys_time FROM driver, supporter, route WHERE route.driver_id = driver.id AND route.supporter_id = supporter.id', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Route.add = function(route, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO route SET ?', route, function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Route.search = function(skw, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT route.id, vehicle_number, driver.first_name AS driver_first_name, driver.last_name AS driver_last_name, supporter.first_name AS supporter_first_name, supporter.last_name AS supporter_last_name, source_documents, DATE_FORMAT(route_start_time, \'%Y-%m-%d %H:%i:%S\') AS route_start_time, DATE_FORMAT(route_end_time, \'%Y-%m-%d %H:%i:%S\') AS route_end_time, start_meter, end_meter, start_location, end_location, document_front, DATE_FORMAT(sys_time, \'%Y-%m-%d %H:%i:%S\') AS sys_time FROM route LEFT JOIN driver ON route.driver_id = driver.id LEFT JOIN supporter ON route.supporter_id = supporter.id WHERE CONCAT_WS(route.id, vehicle_number, driver.first_name, driver.last_name, supporter.first_name, supporter.last_name, source_documents, route_start_time, route_end_time, start_meter, end_meter, start_location, end_location, document_front) LIKE \'%' + skw + '%\'', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
