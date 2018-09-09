const MySql = require('../comms/mySqlCon')
const MDate = require('../../functions/mdate')
const ExpenseMyProfile = module.exports = {}

ExpenseMyProfile.all = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select E.id, DATE_FORMAT(E.date, \'%Y-%m-%d\') AS date, DATE_FORMAT(E.sys_date, \'%Y-%m-%d\') AS sys_date, E.username, E.description, SUM(EI.amount) expense_amount, COUNT(EI.id) AS bills, COUNT(CASE EI.bill_received WHEN 1 THEN 1 ELSE NULL END) AS bills_received, COUNT(CASE EI.bill_paid WHEN 1 THEN 1 ELSE NULL END) AS bills_paid, SUM(CASE EI.bill_paid WHEN 1 THEN EI.amount ELSE NULL END) as amount_paid from expense E, expense_item EI where E.username = ? AND E.id = EI.expense_id AND EI.rejected = 0 group by E.id, E.date, E.sys_date, E.username, E.description order by id desc', username, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

ExpenseMyProfile.getItems = function(expenseId, username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select EI.id, EI.expense_id, ET.name, EI.amount, EI.description, EI.bill_received, DATE_FORMAT(EI.bill_received_date, \'%Y-%m-%d\') AS bill_received_date, EI.bill_paid, DATE_FORMAT(EI.bill_paid_date, \'%Y-%m-%d\') AS bill_paid_date, EI.rejected from expense_item EI, expense_type ET, expense E where expense_id = ? and E.id = EI.expense_id AND E.username = ? AND EI.expense_type_id = ET.id', [expenseId, username], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

ExpenseMyProfile.monthlyTotal = function(username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select SUM(Expenses.expense_amount) as total from (select E.id, DATE_FORMAT(E.date, \'%Y-%m-%d\') AS date, DATE_FORMAT(E.sys_date, \'%Y-%m-%d\') AS sys_date, E.username, E.description, SUM(EI.amount) expense_amount, COUNT(EI.id) AS bills, COUNT(CASE EI.bill_received WHEN 1 THEN 1 ELSE NULL END) AS bills_received, COUNT(CASE EI.bill_paid WHEN 1 THEN 1 ELSE NULL END) AS bills_paid, SUM(CASE EI.bill_paid WHEN 1 THEN EI.amount ELSE NULL END) as amount_paid from expense E, expense_item EI where E.username = ? AND E.id = EI.expense_id AND EI.rejected = 0 AND MONTH(sys_date) = MONTH(CURDATE())  group by E.id, E.date, E.sys_date, E.username, E.description order by id desc) AS Expenses', [username], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
