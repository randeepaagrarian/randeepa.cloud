const MySql = require('../comms/mySqlCon')
const SaleMyProfile = module.exports = {}

SaleMyProfile.all = function(officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%i:%S\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE officer = ? ORDER BY id ASC;', officer, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

SaleMyProfile.today = function(officer, date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%i:%S\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE officer = ? AND DATE(sys_date) = ? ORDER BY id ASC;', [officer, date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
