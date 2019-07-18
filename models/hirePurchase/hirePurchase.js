const MySql = require('../comms/mySqlCon')
const MDate = require('../../functions/mdate')
const HirePurchase = module.exports = {}

HirePurchase.newContract = function(contract, installments, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.beginTransaction(function(err) {
            if(err) {
                connection.release()
                return callback(err, null)
            }

            connection.query('INSERT INTO contract SET ?', contract, function(err, results, fields) {
                if(err) {
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, null)
                    })
                }

                installments.forEach(function(installment) {
                    installment.unshift(results.insertId)
                })

                connection.query('INSERT INTO contract_installment (contract_id, amount, due_date) VALUES ?', [installments], function(err, results, fields) {
                    if(err) {
                        return connection.rollback(function() {
                            connection.release()
                            callback(err, null)
                        })
                    }

                    connection.commit(function(err) {
                        if(err) {
                            return connection.rollback(function() {
                                connection.release()
                                callback(err, null)
                            })
                        }
                        connection.release()
                        callback(err, true)
                    })
                })

            })

        })
    })
}

HirePurchase.allContracts = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.id, id_1, id_2, SUM(CASE WHEN (CI.paid = 0 AND CI.due_date < NOW()) THEN CI.amount ELSE 0 END) as amount_pending, M.name as model_name, customer_name, customer_address, customer_contact, guarantor1_name, guarantor1_address, guarantor1_contact, guarantor2_name, guarantor2_address, guarantor2_contact FROM contract C LEFT JOIN model M on M.id = C.model_id LEFT JOIN contract_installment CI on CI.contract_id = C.id GROUP BY C.id, id_1, id_2, model_name, customer_name, customer_address, customer_contact, guarantor1_name, guarantor1_address, guarantor1_contact, guarantor2_name, guarantor2_address, guarantor2_contact', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.installments = function(contractID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT id, contract_id, amount, due_date, paid, paid_on, paid_marked_by, (CASE WHEN (paid = 0 AND due_date < NOW()) THEN 1 ELSE 0 END) as overdue FROM contract_installment WHERE contract_id = ?;', contractID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
