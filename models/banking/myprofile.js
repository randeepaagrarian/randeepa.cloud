const MySql = require('../comms/mySqlCon')
const BankingMyProfile = module.exports = {}

BankingMyProfile.all = function(officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT banking.id, officer, region, bank, branch, amount, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%i:%S\') AS sys_date, source_document, chassis_no, receipt_number, name, invoice_number FROM banking LEFT JOIN machinery_banking ON banking.id = machinery_banking.banking_id LEFT JOIN spare_parts_banking ON banking.id = spare_parts_banking.banking_id LEFT JOIN payment_type ON machinery_banking.payment_type = payment_type.id WHERE officer = ? ORDER BY id ASC', officer, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

BankingMyProfile.today = function(officer, date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT banking.id, officer, region, bank, branch, amount, DATE_FORMAT(date, \'%Y-%m-%d %H:%i:%S\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%i:%S\') AS sys_date, source_document, chassis_no, receipt_number, name, invoice_number FROM banking LEFT JOIN machinery_banking ON banking.id = machinery_banking.banking_id LEFT JOIN spare_parts_banking ON banking.id = spare_parts_banking.banking_id LEFT JOIN payment_type ON machinery_banking.payment_type = payment_type.id WHERE officer = ? AND DATE(sys_date)  = ? ORDER BY id ASC', [officer, date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
