const MySql = require('../comms/mySqlCon')
const Banking = module.exports = {}

Banking.all = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT banking.id, officer, region, bank, branch, amount, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%i:%S\') AS sys_date, source_document, chassis_no, receipt_number, name, invoice_number FROM banking LEFT JOIN machinery_banking ON banking.id = machinery_banking.banking_id LEFT JOIN spare_parts_banking ON banking.id = spare_parts_banking.banking_id LEFT JOIN payment_type ON machinery_banking.payment_type = payment_type.id ORDER BY id DESC', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Banking.byDateRangeAll = function(start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT banking.id, officer, region, bank, branch, amount, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%i:%S\') AS sys_date, source_document, chassis_no, receipt_number, name, invoice_number FROM banking LEFT JOIN machinery_banking ON banking.id = machinery_banking.banking_id LEFT JOIN spare_parts_banking ON banking.id = spare_parts_banking.banking_id LEFT JOIN payment_type ON machinery_banking.payment_type = payment_type.id WHERE DATE(sys_date) BETWEEN ? AND ? ORDER BY id DESC', [start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Banking.byDateRangeRegion = function(start_date, end_date, region, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT banking.id, officer, region, bank, branch, amount, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%i:%S\') AS sys_date, source_document, chassis_no, receipt_number, name, invoice_number FROM banking LEFT JOIN machinery_banking ON banking.id = machinery_banking.banking_id LEFT JOIN spare_parts_banking ON banking.id = spare_parts_banking.banking_id LEFT JOIN payment_type ON machinery_banking.payment_type = payment_type.id WHERE DATE(sys_date) BETWEEN ? AND ? AND region = ? ORDER BY id DESC', [start_date, end_date, region], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Banking.byDateRangeOfficer = function(start_date, end_date, officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT banking.id, officer, region, bank, branch, amount, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%i:%S\') AS sys_date, source_document, chassis_no, receipt_number, name, invoice_number FROM banking LEFT JOIN machinery_banking ON banking.id = machinery_banking.banking_id LEFT JOIN spare_parts_banking ON banking.id = spare_parts_banking.banking_id LEFT JOIN payment_type ON machinery_banking.payment_type = payment_type.id WHERE DATE(sys_date) BETWEEN ? AND ? AND officer = ? ORDER BY id DESC', [start_date, end_date, officer], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
