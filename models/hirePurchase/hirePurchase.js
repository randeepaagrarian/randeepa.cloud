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
        connection.query('SELECT C.contract_id as id, CT.id_1, CT.id_2, CT.sale_id, SUM(CASE WHEN (C.due_date <= NOW() AND C.amount_paid < C.amount) THEN C.amount - C.amount_paid ELSE 0 END) as amount_pending, COALESCE(SUM(C.amount), 0) as contract_amount, COALESCE(SUM(C.amount_paid), 0) as paid_amount, (COALESCE(SUM(C.amount), 0) - COALESCE(SUM(C.amount_paid), 0)) as to_be_collected, (CASE WHEN (MAX(C.due_date) <= NOW()) THEN 1 ELSE 0 END) as contract_finished, DATEDIFF(MAX(C.due_date), NOW()) as contract_finishes_in, M.name as model_name, CB.name as batch_name, U.name as recovery_officer, MIN(C.due_date) as contract_start_date, CT.customer_name, CT.customer_address, CT.customer_contact, CT.guarantor1_name, CT.guarantor1_address, CT.guarantor1_contact, CT.guarantor2_name, CT.guarantor2_address, CT.guarantor2_contact FROM (SELECT CI.contract_id, CI.id, CI.amount, CI.due_date, COALESCE(SUM(CIP.amount), 0) as amount_paid FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date) C LEFT JOIN contract CT on C.contract_id = CT.id LEFT JOIN model M on M.id = CT.model_id LEFT JOIN contract_batch CB ON CT.contract_batch_id = CB.id LEFT JOIN user U ON CT.recovery_officer = U.username WHERE CT.closed = 0 GROUP BY C.contract_id ORDER BY CT.id_1 ASC', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.allContractsAsAt = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.contract_id as id, CT.id_1, CT.id_2, CT.sale_id, SUM(CASE WHEN (C.due_date <= ? AND C.amount_paid < C.amount) THEN C.amount - C.amount_paid ELSE 0 END) as amount_pending, COALESCE(SUM(C.amount), 0) as contract_amount, COALESCE(SUM(C.amount_paid), 0) as paid_amount, (COALESCE(SUM(C.amount), 0) - COALESCE(SUM(C.amount_paid), 0)) as to_be_collected, (CASE WHEN (MAX(C.due_date) <= ?) THEN 1 ELSE 0 END) as contract_finished, DATEDIFF(MAX(C.due_date), ?) as contract_finishes_in, M.name as model_name, CB.name as batch_name, U.name as recovery_officer, MIN(C.due_date) as contract_start_date, CT.customer_name, CT.customer_address, CT.customer_contact, CT.guarantor1_name, CT.guarantor1_address, CT.guarantor1_contact, CT.guarantor2_name, CT.guarantor2_address, CT.guarantor2_contact FROM (SELECT CI.contract_id, CI.id, CI.amount, CI.due_date, COALESCE(SUM(CIP.amount), 0) as amount_paid FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date) C LEFT JOIN contract CT on C.contract_id = CT.id LEFT JOIN model M on M.id = CT.model_id LEFT JOIN contract_batch CB ON CT.contract_batch_id = CB.id LEFT JOIN user U ON CT.recovery_officer = U.username WHERE CT.closed = 0 GROUP BY C.contract_id ORDER BY CT.id_1 ASC', [date, date, date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.allContractsAsAtByBatch = function(date, batch, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.contract_id as id, CT.id_1, CT.id_2, CT.sale_id, SUM(CASE WHEN (C.due_date <= ? AND C.amount_paid < C.amount) THEN C.amount - C.amount_paid ELSE 0 END) as amount_pending, COALESCE(SUM(C.amount), 0) as contract_amount, COALESCE(SUM(C.amount_paid), 0) as paid_amount, (COALESCE(SUM(C.amount), 0) - COALESCE(SUM(C.amount_paid), 0)) as to_be_collected, (CASE WHEN (MAX(C.due_date) <= ?) THEN 1 ELSE 0 END) as contract_finished, DATEDIFF(MAX(C.due_date), ?) as contract_finishes_in, M.name as model_name, CB.name as batch_name, U.name as recovery_officer, MIN(C.due_date) as contract_start_date, CT.customer_name, CT.customer_address, CT.customer_contact, CT.guarantor1_name, CT.guarantor1_address, CT.guarantor1_contact, CT.guarantor2_name, CT.guarantor2_address, CT.guarantor2_contact FROM (SELECT CI.contract_id, CI.id, CI.amount, CI.due_date, COALESCE(SUM(CIP.amount), 0) as amount_paid FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date) C LEFT JOIN contract CT on C.contract_id = CT.id LEFT JOIN model M on M.id = CT.model_id LEFT JOIN contract_batch CB ON CT.contract_batch_id = CB.id LEFT JOIN user U ON CT.recovery_officer = U.username WHERE CT.closed = 0 AND CT.contract_batch_id = ? GROUP BY C.contract_id ORDER BY CT.id_1 ASC', [date, date, date, batch], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.allContractsByBatch = function(batchID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.contract_id as id, CT.id_1, CT.id_2, CT.sale_id, SUM(CASE WHEN (C.due_date <= NOW() AND C.amount_paid < C.amount) THEN C.amount - C.amount_paid ELSE 0 END) as amount_pending, COALESCE(SUM(C.amount), 0) as contract_amount, COALESCE(SUM(C.amount_paid), 0) as paid_amount, (COALESCE(SUM(C.amount), 0) - COALESCE(SUM(C.amount_paid), 0)) as to_be_collected, (CASE WHEN (MAX(C.due_date) <= NOW()) THEN 1 ELSE 0 END) as contract_finished, DATEDIFF(MAX(C.due_date), NOW()) as contract_finishes_in, M.name as model_name, CB.name as batch_name, U.name as recovery_officer, MIN(C.due_date) as contract_start_date, CT.customer_name, CT.customer_address, CT.customer_contact, CT.guarantor1_name, CT.guarantor1_address, CT.guarantor1_contact, CT.guarantor2_name, CT.guarantor2_address, CT.guarantor2_contact FROM (SELECT CI.contract_id, CI.id, CI.amount, CI.due_date, COALESCE(SUM(CIP.amount), 0) as amount_paid FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date) C LEFT JOIN contract CT on C.contract_id = CT.id LEFT JOIN model M on M.id = CT.model_id LEFT JOIN contract_batch CB ON CT.contract_batch_id = CB.id LEFT JOIN user U ON CT.recovery_officer = U.username WHERE CT.closed = 0 AND CT.contract_batch_id = ? GROUP BY C.contract_id ORDER BY CT.id_1 ASC', [batchID], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.allContractsByRecoveryOfficer = function(recoveryOfficer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.contract_id as id, CT.id_1, CT.id_2, CT.sale_id, SUM(CASE WHEN (C.due_date <= NOW() AND C.amount_paid < C.amount) THEN C.amount - C.amount_paid ELSE 0 END) as amount_pending, COALESCE(SUM(C.amount), 0) as contract_amount, COALESCE(SUM(C.amount_paid), 0) as paid_amount, (COALESCE(SUM(C.amount), 0) - COALESCE(SUM(C.amount_paid), 0)) as to_be_collected, (CASE WHEN (MAX(C.due_date) <= NOW()) THEN 1 ELSE 0 END) as contract_finished, DATEDIFF(MAX(C.due_date), NOW()) as contract_finishes_in, M.name as model_name, CB.name as batch_name, U.name as recovery_officer, MIN(C.due_date) as contract_start_date, CT.customer_name, CT.customer_address, CT.customer_contact, CT.guarantor1_name, CT.guarantor1_address, CT.guarantor1_contact, CT.guarantor2_name, CT.guarantor2_address, CT.guarantor2_contact FROM (SELECT CI.contract_id, CI.id, CI.amount, CI.due_date, COALESCE(SUM(CIP.amount), 0) as amount_paid FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date) C LEFT JOIN contract CT on C.contract_id = CT.id LEFT JOIN model M on M.id = CT.model_id LEFT JOIN contract_batch CB ON CT.contract_batch_id = CB.id LEFT JOIN user U ON CT.recovery_officer = U.username WHERE CT.closed = 0 AND CT.recovery_officer = ? GROUP BY C.contract_id ORDER BY CT.id_1 ASC', [recoveryOfficer], function(err, rows, fields) {
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
        connection.query('SELECT CI.id, CI.contract_id, CI.amount, CI.due_date, COALESCE(SUM(CIP.amount), 0) AS amount_paid, (CASE WHEN (CI.due_date <= NOW() AND COALESCE(SUM(CIP.amount), 0) < CI.amount) THEN 1 ELSE 0 END) as overdue, (CASE WHEN(CI.due_date > NOW()) THEN 1 ELSE 0 END) as upcoming FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CIP.contract_installment_id = CI.id WHERE contract_id = ? GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date;', contractID, function(err, rows, fields) {
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

HirePurchase.addReceipt = function(receipt, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, false)
        }
        connection.query('INSERT INTO contract_receipt SET ?;', receipt, function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, false)
            }

            return callback(err, true)
        })
    })
}

HirePurchase.validReceiptAllocation = function(receiptNo, amount, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, false)
        }
        connection.query('SELECT CR.id, CR.amount, COALESCE(SUM(CIP.amount), 0) as amount_paid FROM contract_receipt CR LEFT JOIN contract_installment_payment CIP ON CR.id = CIP.contract_receipt_id WHERE CR.id = ? GROUP BY CR.id, CR.amount;', receiptNo, function(err, rows, fields) {
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

HirePurchase.receipts = function(contractID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.id as contract_id, CR.id as receipt_id, CR.date, CR.amount, CR.tr_number, CR.tr_book_number, COALESCE(SUM(CIP.amount), 0) as amount_allocated, (CR.amount - COALESCE(SUM(CIP.amount), 0)) as to_be_allocated FROM contract_receipt CR LEFT JOIN contract_installment_payment CIP ON CR.id = CIP.contract_receipt_id LEFT JOIN contract C ON C.id = CR.contract_id WHERE C.id = ?  GROUP BY CR.id, CR.amount;', contractID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.receiptDetails = function(receiptID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.id_1, C.customer_name, C.customer_address, C.customer_contact, CR.amount, CR.tr_number, CR.date, CR.issued_on, CR.issued_user FROM contract_receipt CR LEFT JOIN contract C ON C.id = CR.contract_id WHERE CR.id = ?;', receiptID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.getRecoveryOfficers = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT username as id, name FROM user WHERE designation_fk = 4', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.getBatches = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM contract_batch', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.editLocked = function(installmentID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.edit_lock FROM contract_installment CI LEFT JOIN contract C ON C.id = CI.contract_id WHERE CI.id = ?;', [installmentID], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }

            const edit_lock = rows[0].edit_lock

            if(edit_lock == 0) {
                return callback(err, false)
            } else {
                return callback(err, true)
            }
        })
    })
}

HirePurchase.contractEditLocked = function(contractID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.edit_lock FROM contract C WHERE C.id = ?;', [contractID], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }

            const edit_lock = rows[0].edit_lock

            if(edit_lock == 0) {
                return callback(err, false)
            } else {
                return callback(err, true)
            }
        })
    })
}


HirePurchase.getInstallmentDetails = function(installmentID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT amount, due_date FROM contract_installment WHERE id = ?', [installmentID], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.changeInstallment = function(installmentID, installmentChange, datetime, changed_by, reason, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.beginTransaction(function(err) {
            if(err) {
                connection.release()
                return callback(err, false)
            }

            connection.query('INSERT INTO contract_installment_history (date_in, changed_by, change_reason, contract_installment_id, contract_id, amount, due_date) SELECT ?, ?, ?, id, contract_id, amount, due_date FROM contract_installment WHERE id = ?', [datetime, changed_by, reason, installmentID], function(err, result) {
                if(err) {
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, false)
                    })
                }

                connection.query('UPDATE contract_installment SET ? WHERE id = ?', [installmentChange, installmentID], function(err, result) {
                    if(err) {
                        return connection.rollback(function() {
                            connection.release()
                            callback(err, false)
                        })
                    }

                    connection.commit(function(err) {
                        if(err) {
                            return connection.rollback(function() {
                                connection.release()
                                callback(err, false)
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

HirePurchase.getContractInfo = function(contractID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.contract_id as id, CT.id_1, CT.id_2, CT.sale_id, SUM(CASE WHEN (C.due_date <= NOW() AND C.amount_paid < C.amount) THEN C.amount - C.amount_paid ELSE 0 END) as amount_pending, COALESCE(SUM(C.amount), 0) as contract_amount, COALESCE(SUM(C.amount_paid), 0) as paid_amount, (COALESCE(SUM(C.amount), 0) - COALESCE(SUM(C.amount_paid), 0)) as to_be_collected, (CASE WHEN (MAX(C.due_date) <= NOW()) THEN 1 ELSE 0 END) as contract_finished, DATEDIFF(MAX(C.due_date), NOW()) as contract_finishes_in, M.name as model_name, CB.name as batch_name, U.name as recovery_officer, MIN(C.due_date) as contract_start_date, CT.customer_name, CT.customer_address, CT.customer_contact, CT.guarantor1_name, CT.guarantor1_address, CT.guarantor1_contact, CT.guarantor2_name, CT.guarantor2_address, CT.guarantor2_contact FROM (SELECT CI.contract_id, CI.id, CI.amount, CI.due_date, COALESCE(SUM(CIP.amount), 0) as amount_paid FROM contract_installment CI LEFT JOIN contract C ON CI.contract_id = C.id LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id WHERE C.id = ? GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date) C LEFT JOIN contract CT on C.contract_id = CT.id LEFT JOIN model M on M.id = CT.model_id LEFT JOIN contract_batch CB ON CT.contract_batch_id = CB.id LEFT JOIN user U ON CT.recovery_officer = U.username WHERE CT.closed = 0 GROUP BY C.contract_id', contractID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.rawInfo = function(contractID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT * FROM contract WHERE id = ?', contractID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.edit = function(contractID, newContract, user, datetime, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, false)
      }
  
      connection.beginTransaction(function(err) {
        if(err) {
            connection.release()
            return callback(err, false)
        }
  
        connection.query('INSERT INTO contract_history (id, date, user, id_1, id_2, model_id, contract_batch_id, recovery_officer, sale_id, customer_name, customer_address, customer_contact, guarantor1_name, guarantor1_address, guarantor1_contact, guarantor2_name, guarantor2_address, guarantor2_contact, edit_lock, closed, date_in, modified_by) SELECT id, date, user, id_1, id_2, model_id, contract_batch_id, recovery_officer, sale_id, customer_name, customer_address, customer_contact, guarantor1_name, guarantor1_address, guarantor1_contact, guarantor2_name, guarantor2_address, guarantor2_contact, edit_lock, closed, ?, ? FROM contract WHERE id = ?', [datetime, user, contractID], function(err, rows, fields) {
  
          if(err) {
              return connection.rollback(function() {
                  connection.release()
                  callback(err, false)
              })
          }
  
          connection.query('UPDATE contract SET ? WHERE id = ?', [newContract, contractID], function(err, rows, fields) {
              if(err) {
                  return connection.rollback(function() {
                      connection.release()
                      callback(err, false)
                  })
              }
  
              connection.commit(function(err) {
                  if(err) {
                      return connection.rollback(function() {
                          connection.release()
                          callback(err, false)
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

HirePurchase.pendingInstallments = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.id_1, C.id_2, CI.contract_id, CI.id, CI.amount, CI.due_date, DATEDIFF(CI.due_date, NOW()) as due_for, COALESCE(SUM(CIP.amount), 0) as amount_paid, M.name as model_name, CB.name as batch_name, U.name as recovery_officer, C.customer_name, C.customer_address, C.customer_contact FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id LEFT JOIN contract C ON C.id = CI.contract_id LEFT JOIN model M on C.model_id = M.id LEFT JOIN contract_batch CB on C.contract_batch_id = CB.id LEFT JOIN user U on C.recovery_officer = U.username WHERE CI.due_date < ? GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date HAVING CI.amount > COALESCE(SUM(CIP.amount), 0)', date, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.pendingInstallmentsArrears = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.id_1, C.id_2, CI.contract_id, CI.id, CI.amount, CI.due_date, DATEDIFF(CI.due_date, NOW()) as due_for, COALESCE(SUM(CIP.amount), 0) as amount_paid, M.name as model_name, CB.name as batch_name, U.name as recovery_officer, C.customer_name, C.customer_address, C.customer_contact FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id LEFT JOIN contract C ON C.id = CI.contract_id LEFT JOIN model M on C.model_id = M.id LEFT JOIN contract_batch CB on C.contract_batch_id = CB.id LEFT JOIN user U on C.recovery_officer = U.username WHERE CI.due_date < ? GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date HAVING CI.amount > COALESCE(SUM(CIP.amount), 0) AND DATEDIFF(CI.due_date, NOW()) < 0', date, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.pendingInstallmentsUpcoming = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT C.id_1, C.id_2, CI.contract_id, CI.id, CI.amount, CI.due_date, DATEDIFF(CI.due_date, NOW()) as due_for, COALESCE(SUM(CIP.amount), 0) as amount_paid, M.name as model_name, CB.name as batch_name, U.name as recovery_officer, C.customer_name, C.customer_address, C.customer_contact FROM contract_installment CI LEFT JOIN contract_installment_payment CIP ON CI.id = CIP.contract_installment_id LEFT JOIN contract C ON C.id = CI.contract_id LEFT JOIN model M on C.model_id = M.id LEFT JOIN contract_batch CB on C.contract_batch_id = CB.id LEFT JOIN user U on C.recovery_officer = U.username WHERE CI.due_date < ? GROUP BY CI.id, CI.contract_id, CI.amount, CI.due_date HAVING CI.amount > COALESCE(SUM(CIP.amount), 0) AND DATEDIFF(CI.due_date, NOW()) > 0', date, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.addComment = function(comment, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO contract_comment SET ?', comment, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, false)
            }
            callback(err, true)
        })
    })
}

HirePurchase.getComments = function(contractID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT CC.id, CC.installment_id, U.name as user, CC.date, CC.text, CC.commitment, CC.fulfilled, DATEDIFF(CC.due_date, NOW()) as expires, CC.fulfilled_type FROM contract_comment CC LEFT JOIN user U ON CC.username = U.username WHERE CC.contract_id = ? ORDER BY CC.date DESC;', contractID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

HirePurchase.fulfill = function(fulfillType, commentID, username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('UPDATE contract_comment SET ? WHERE id = ?;', [fulfillType, commentID], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, false)
            }
            callback(err, true)
        })
    })
}

HirePurchase.getPendingCommitments = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT CC.contract_id, C.id_1, CC.installment_id, DATEDIFF(CC.due_date, NOW()) as expires, CC.text FROM contract_comment CC LEFT JOIN contract C ON CC.contract_id = C.id WHERE CC.commitment = 1 AND CC.fulfilled = 0', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}