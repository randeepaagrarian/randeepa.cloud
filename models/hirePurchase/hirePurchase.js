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
        connection.query('SELECT C.contract_id as id, CT.id_1, CT.id_2, SUM(CASE WHEN (C.due_date <= NOW() AND C.amount_paid < C.amount) THEN C.amount - C.amount_paid ELSE 0 END) as amount_pending, M.name as model_name, CT.customer_name, CT.customer_address, CT.customer_contact, CT.guarantor1_name, CT.guarantor1_address, CT.guarantor1_contact, CT.guarantor2_name, CT.guarantor2_address, CT.guarantor2_contact FROM (SELECT CI.contract_id, CI.id, CI.amount, CI.due_date, COALESCE(SUM(CIP.amount), 0) as amount_paid FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date) C LEFT JOIN contract CT on C.contract_id = CT.id LEFT JOIN model M on M.id = CT.model_id GROUP BY C.contract_id', function(err, rows, fields) {
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
        connection.query('SELECT CI.id, CI.contract_id, CI.amount, CI.due_date, COALESCE(SUM(CIP.amount), 0) AS amount_paid, (CASE WHEN (CI.due_date <= NOW() AND COALESCE(SUM(CIP.amount), 0) < CI.amount) THEN 1 ELSE 0 END) as overdue FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CIP.contract_installment_id = CI.id WHERE contract_id = ? GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date;', contractID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.validPaymentAmount = function(installmentID, amount, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, false)
        }
        connection.query('SELECT CI.id, CI.amount, COALESCE(SUM(CIP.amount), 0) as amount_paid FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id WHERE CI.id = ? GROUP BY CI.id, CI.amount;', installmentID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, false)
            }

            const amount_db = parseInt(rows[0].amount)
            const amount_paid = parseInt(rows[0].amount_paid) + parseInt(amount)

            if(amount_paid <= amount_db) {
                return callback(err, true)
            } else {
                return callback(err, false)
            }
        })
    })
}

HirePurchase.addPayment = function(payment, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, false)
        }
        connection.query('INSERT INTO contract_installment_payment SET ?;', payment, function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, false)
            }

            return callback(err, true)
        })
    })
}

HirePurchase.getPayments = function(installmentID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM contract_installment_payment WHERE contract_installment_id = ?;', installmentID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}