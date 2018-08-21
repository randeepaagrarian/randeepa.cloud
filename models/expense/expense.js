const MySql = require('../comms/mySqlCon2')
const MDate = require('../../functions/mdate')
const Expense = module.exports = {}

Expense.all = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select E.id, DATE_FORMAT(E.date, \'%Y-%m-%d\') AS date, DATE_FORMAT(E.sys_date, \'%Y-%m-%d %H:%i:%s\') AS sys_date, E.username, E.description, SUM(EI.amount) expense_amount, COUNT(EI.id) AS bills, COUNT(CASE EI.bill_received WHEN 1 THEN 1 ELSE NULL END) AS bills_received, COUNT(CASE EI.bill_paid WHEN 1 THEN 1 ELSE NULL END) AS bills_paid, SUM(CASE EI.bill_paid WHEN 1 THEN EI.amount ELSE NULL END) as amount_paid from expense E, expense_item EI where E.id = EI.expense_id AND EI.rejected = 0 group by E.id, E.date, E.sys_date, E.username, E.description order by id desc', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Expense.getItems = function(expenseId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select EI.id, EI.expense_id, ET.name, EI.amount, EI.description, EI.bill_received, DATE_FORMAT(EI.bill_received_date, \'%Y-%m-%d\') AS bill_received_date, EI.bill_paid, DATE_FORMAT(EI.bill_paid_date, \'%Y-%m-%d\') AS bill_paid_date, EI.rejected from expense_item EI, expense_type ET where expense_id = ? and EI.expense_type_id = ET.id', expenseId, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Expense.markBillReceived = function(expenseItemId, username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('UPDATE expense_item SET bill_received = 1, bill_received_date = ?, bill_received_marked_by = ? WHERE id = ? AND rejected = 0', [MDate.getDate('-'), username, expenseItemId], function(err, result, fields) {
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Expense.markBillPaid = function(expenseItemId, username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('UPDATE expense_item SET bill_paid = 1, bill_paid_date = ?, bill_paid_marked_by = ? WHERE id = ? AND rejected = 0 AND bill_received = 1', [MDate.getDate('-'), username, expenseItemId], function(err, result, fields) {
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Expense.markBillRejected = function(expenseItemId, username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('UPDATE expense_item SET rejected = 1, rejected_date = ?, rejected_marked_by = ? WHERE id = ? AND bill_paid = 0', [MDate.getDate('-'), username, expenseItemId], function(err, result, fields) {
            if(err) {
                return callback(err, null)
            }
            callback(err, true)
        })
    })
}

Expense.monthlyTotal = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select SUM(Expenses.expense_amount) as total from (select E.id, DATE_FORMAT(E.date, \'%Y-%m-%d\') AS date, DATE_FORMAT(E.sys_date, \'%Y-%m-%d\') AS sys_date, E.username, E.description, SUM(EI.amount) expense_amount, COUNT(EI.id) AS bills, COUNT(CASE EI.bill_received WHEN 1 THEN 1 ELSE NULL END) AS bills_received, COUNT(CASE EI.bill_paid WHEN 1 THEN 1 ELSE NULL END) AS bills_paid, SUM(CASE EI.bill_paid WHEN 1 THEN EI.amount ELSE NULL END) as amount_paid from expense E, expense_item EI where E.id = EI.expense_id AND EI.rejected = 0 AND MONTH(sys_date) = MONTH(CURDATE())  group by E.id, E.date, E.sys_date, E.username, E.description order by id desc) AS Expenses', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
