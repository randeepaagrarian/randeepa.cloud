const MySql = require('../comms/mySqlCon')
const Sales = module.exports = {}

Sales.topRegionsByMonth = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(*) AS sales, region, name FROM sale LEFT JOIN report_region ON sale.region = report_region.id WHERE YEAR(sys_date) = ? AND MONTH(sys_date) = ? GROUP BY region, name ORDER BY sales DESC LIMIT 4;', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sales.topOfficersByMonth = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(*) AS sales, officer, user.name, sale.region, report_region.name AS region_name FROM sale LEFT JOIN user ON sale.officer = user.username LEFT JOIN report_region ON sale.region = report_region.id WHERE YEAR(sys_date) = ? AND MONTH(sys_date) = ? GROUP BY officer, user.name, region, report_region.name ORDER BY sales DESC LIMIT 5;', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sales.byModelMonth = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(*) AS sales, name FROM sale LEFT JOIN model ON sale.model = model.id WHERE YEAR(sys_date) = ? AND MONTH(sys_date) = ? GROUP BY model ORDER BY sales DESC;', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sales.byOfficerMonth = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(*) AS sales, officer, user.name, sale.region, report_region.name AS region_name FROM sale LEFT JOIN user ON sale.officer = user.username LEFT JOIN report_region ON sale.region = report_region.id WHERE YEAR(sys_date) = ? AND MONTH(sys_date) = ? GROUP BY officer, user.name, region, report_region.name ORDER BY sales DESC;', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
