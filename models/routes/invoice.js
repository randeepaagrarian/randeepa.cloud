const MySql = require('../comms/mySqlCon')
const Invoice = module.exports = {}

const MDate = require('../../functions/mdate')

Invoice.getUnbilledRoutes = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT id, vehicle_number, DATE_FORMAT(route_start_time, \'%Y-%m-%d\') AS route_start_time, DATE_FORMAT(route_end_time, \'%Y-%m-%d %H:%i:%S\') AS route_end_time, start_meter, end_meter, start_location, end_location, DATE_FORMAT(sys_time, \'%Y-%m-%d %H:%i:%S\') AS sys_time, (end_meter - start_meter) AS mileage FROM route WHERE billed = 0', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Invoice.markRoutesBilled = function(routes, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        if(routes instanceof Array) {
            connection.query('UPDATE route SET billed = 1 WHERE id IN (' + routes.join() + ')', function(err, result) {
                connection.release()
                if(err) {
                    return callback(err, null)
                }
                callback(err, true)
            })
        } else {
            connection.query('UPDATE route SET billed = 1 WHERE id IN (?)', routes, function(err, result) {
                connection.release()
                if(err) {
                    return callback(err, null)
                }
                callback(err, true)
            })
        }
    })
}

Invoice.create = function(invoice, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO route_invoice SET ?', invoice, function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, result)
        })
    })
}

Invoice.addContents = function(contents, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO route_invoice_contents (invoice_id, route_id, rate) VALUES ?', [contents], function(err, result) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Invoice.getAll = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM route_invoice', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Invoice.getContents = function(invoiceID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT route_id, rate, route_pass_id, source_documents, DATE_FORMAT(route_start_time, \'%Y-%m-%d\') AS route_start_time, vehicle_number, (end_meter - start_meter) AS mileage, end_location, ((end_meter - start_meter) * rate) AS route_cost FROM route_invoice_contents LEFT JOIN route ON route_invoice_contents.route_id = route.id WHERE invoice_id = ?', invoiceID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Invoice.getSummary = function(routes, callback) {
    err = null
    var total = 0
    for(i = 0; i < routes.length; i++) {
        total = total + routes[i]['route_cost']
    }
    callback(err, {total: total})
}

Invoice.getDetails = function(invoiceID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT id, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, issuer FROM route_invoice WHERE id = ?', invoiceID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
