const MySql = require('../comms/mySqlCon')
const SaleAreaProfile = module.exports = {}

SaleAreaProfile.all = function(region, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE  S.deleted = 0 AND  S.region = ? ORDER BY S.id DESC', region, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

SaleAreaProfile.today = function(region, date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE  S.deleted = 0 AND  S.region = ? AND DATE(S.sys_date) = ? ORDER BY S.id DESC', [region, date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
