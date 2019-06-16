const MySql = require('../comms/mySqlCon')
const MDate = require('../../functions/mdate')
const Service = module.exports = {}

Service.getTechnicians = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT username as id, name FROM user WHERE designation_fk = 3', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Service.newService = function(service, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO service SET ?', service, function(err, result) {
            connection.release()
            if(err) {
                return callback(err, false)
            }
            callback(err, true)
        })
    })
}

Service.byDate = function(startDate, endDate, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err){
            return callback(pool_err, null)
        }
        connection.query('SELECT SR.id, SR.date, SR.issue, SR.sale_id, SR.sale_date, S.sys_date as s_sale_date, SR.chassis_no, S.chassis_no as s_chassis_no, SR_M.name as model_name, S_M.name as s_model_name, SR.meter, SR.meter_type, SR.customer_name, SR. customer_contact, S.customer_contact as s_customer_contact, SR.current_address, S.customer_address as s_customer_address, SR_D.name as dealer_name, S_D.name as s_dealer_name, U.name as technician_name, SR.work_sheet, SR.technician_allocated, SR.service_completed FROM service SR LEFT JOIN sale S ON S.id = SR.sale_id LEFT JOIN dealer SR_D ON SR.dealer_id = SR_D.id LEFT JOIN dealer S_D ON S.location_fk = S_D.id LEFT JOIN model SR_M ON SR.model_id = SR_M.id LEFT JOIN model S_M on S.model = S_M.id LEFT JOIN user U ON SR.technician_id = U.username WHERE DATE(SR.date) BETWEEN ? AND ?;', [startDate, endDate], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Service.saleIDEntered = function(serviceID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT sale_id FROM service WHERE id = ?', serviceID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, false)
            }

            callback(err, rows)
        })
    })
}

Service.serviceInfo = function(serviceID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err){
            return callback(pool_err, null)
        }
        connection.query('SELECT SR.id, SR.date, SR.issue, SR.sale_id, SR.sale_date, SR.chassis_no, SR_M.name as model_name, SR.meter, SR.meter_type, SR.customer_name, SR. customer_contact, SR.current_address, SR_D.name as dealer_name, U.name as technician_name, SR.work_sheet, SR.technician_allocated, SR.technician_allocated_by, SR.technician_allocated_on, SR.service_completed, SR.service_completed_remarks, SR.service_completed_by, SR.service_completed_on FROM service SR LEFT JOIN dealer SR_D ON SR.dealer_id = SR_D.id LEFT JOIN model SR_M ON SR.model_id = SR_M.id LEFT JOIN user U ON SR.technician_id = U.username WHERE SR.id = ?;', [serviceID], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Service.updateService = function(update, serviceID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('UPDATE service SET ? WHERE id = ?', [update, serviceID], function(err, result) {
            connection.release()
            if(err) {
                return callback(err, false)
            }
            callback(err, true)
        })
    })
}

Service.changeTechnician = function(serviceID, datetime, username, reason, technician, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.beginTransaction(function(err) {
            if(err) {
                connection.release()
                return callback(err, false)
            }

            connection.query('INSERT INTO service_technician_change_history (date_in, service_id, changed_by, technician_id, technician_allocated_by, technician_allocated_on, reason) SELECT ?, id, ?, technician_id, technician_allocated_by, technician_allocated_on, ? FROM service WHERE id = ?', [datetime, username, reason, serviceID], function(err, result) {
                if(err) {
                    return connection.rollback(function() {
                        connection.release()
                        callback(err, false)
                    })
                }

                connection.query('UPDATE service SET ? WHERE id = ?', [technician, serviceID], function(err, result) {
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

Service.allocatedTechnician = function(serviceID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT U.name as technician_name, SR.technician_allocated_by, SR.technician_allocated_on FROM service SR LEFT JOIN user U ON SR.technician_id = U.username WHERE SR.id = ?;', serviceID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Service.allocatedTechnicianHistory = function(serviceID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT U.name as technician_name, SR.technician_allocated_by, SR.technician_allocated_on, SR.changed_by, SR.date_in as changed_on, SR.reason FROM service_technician_change_history SR LEFT JOIN user U ON SR.technician_id = U.username WHERE SR.service_id = ? ORDER BY SR.date_in DESC;', serviceID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
