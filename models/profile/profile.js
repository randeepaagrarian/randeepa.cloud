const MySql = require('../comms/mySqlCon')
const Profile = module.exports = {}

Profile.officerPerformanceSummary = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('CALL OfficerPerformanceSummary(?, ?, ?);', [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}

Profile.companyOfficerPerformanceSummary = function(start_date, end_date, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
      return callback(pool_err, null)
    }

    connection.query('CALL CompanyOfficerPerformanceSummary(?, ?);', [start_date, end_date], function(err, rows, fields) {
      if(err) {
        return callback(err, null)
      } else {
        callback(err, rows)
      }
    })
  })
}

Profile.salesUnitDetails = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query("SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, '%Y-%m-%d') as date, DATE_FORMAT(S.sys_date, '%Y-%m-%d %H:%I:%S') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE S.officer = ? AND DATE(S.sys_date) BETWEEN ? AND ? ORDER BY S.id DESC", [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}

Profile.dealerVisits = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query("SELECT OV.id, DATE_FORMAT(OV.date, '%Y-%m-%d') as date, DATE_FORMAT(OV.sys_date, '%Y-%m-%d %H:%I:%S') as sys_date, OV.officer, U.name as officer_name, R.name as region_name, T.name as territory_name, OV.start_meter, OV.end_meter, OT.name as organization_type_name, OV.organization_name, O.name as bf_organization_name, D.name as d_organization_name, COUNT(OS.id) as stocks, COUNT(OI.id) as inquiries, OV.location, OV.purpose, OV.outcome, OV.contact_person, OV.contact_number, OV.latitude, OV.longitude FROM organizational_visit OV LEFT JOIN organizational_visit_stock OS ON OV.id = OS.organizational_visit_id LEFT JOIN organizational_visit_inquiry OI ON OV.id = OI.organizational_visit_id LEFT JOIN region R ON OV.region = R.id LEFT JOIN territory T ON OV.territory = T.id LEFT JOIN user U ON OV.officer = U.username LEFT JOIN organization_type OT ON OV.organization_type_id = OT.id LEFT JOIN organization O ON OV.organization_name_fk = O.id AND OV.organization_type_id IN (1, 2) AND OV.organization_name_fk <> 0 LEFT JOIN dealer D ON OV.organization_name_fk = D.id AND OV.organization_type_id IN (6, 7) AND OV.organization_name_fk <> 0 WHERE OV.organization_type_id = 6 AND OV.officer = ? AND DATE(OV.sys_date) BETWEEN ? AND ? GROUP BY OV.id, date, sys_date, officer_name, region_name, territory_name, OV.start_meter, OV.end_meter, organization_type_name, OV.organization_name, bf_organization_name, d_organization_name, OV.location, OV.purpose, OV.outcome, OV.contact_person, OV.contact_number, OV.latitude, OV.longitude ORDER BY OV.id DESC", [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}

Profile.bankings = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query("SELECT banking.id, officer, user.name as officer_name, region.name as region, territory.name as territory, bank, branch, amount, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%S') AS date, DATE_FORMAT(sys_date, '%Y-%m-%d %H:%i:%S') AS sys_date, source_document, chassis_no, receipt_number, payment_type.name, invoice_number FROM banking LEFT JOIN machinery_banking ON banking.id = machinery_banking.banking_id LEFT JOIN spare_parts_banking ON banking.id = spare_parts_banking.banking_id LEFT JOIN payment_type ON machinery_banking.payment_type = payment_type.id LEFT JOIN region ON banking.region = region.id LEFT JOIN territory ON banking.territory = territory.id LEFT JOIN user ON banking.officer = user.username WHERE officer = ? AND DATE(sys_date)  BETWEEN ? AND ? ORDER BY id DESC", [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}

Profile.instituteVisits = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query("SELECT OV.id, DATE_FORMAT(OV.date, '%Y-%m-%d') as date, DATE_FORMAT(OV.sys_date, '%Y-%m-%d %H:%I:%S') as sys_date, OV.officer, U.name as officer_name, R.name as region_name, T.name as territory_name, OV.start_meter, OV.end_meter, OT.name as organization_type_name, OV.organization_name, O.name as bf_organization_name, D.name as d_organization_name, COUNT(OS.id) as stocks, COUNT(OI.id) as inquiries, OV.location, OV.purpose, OV.outcome, OV.contact_person, OV.contact_number, OV.latitude, OV.longitude FROM organizational_visit OV LEFT JOIN organizational_visit_stock OS ON OV.id = OS.organizational_visit_id LEFT JOIN organizational_visit_inquiry OI ON OV.id = OI.organizational_visit_id LEFT JOIN region R ON OV.region = R.id LEFT JOIN territory T ON OV.territory = T.id LEFT JOIN user U ON OV.officer = U.username LEFT JOIN organization_type OT ON OV.organization_type_id = OT.id LEFT JOIN organization O ON OV.organization_name_fk = O.id AND OV.organization_type_id IN (1, 2) AND OV.organization_name_fk <> 0 LEFT JOIN dealer D ON OV.organization_name_fk = D.id AND OV.organization_type_id IN (1,2,3,7) AND OV.organization_name_fk <> 0 WHERE OV.organization_type_id IN (1, 2) AND OV.officer = ? AND DATE(OV.sys_date) BETWEEN ? AND ? GROUP BY OV.id, date, sys_date, officer_name, region_name, territory_name, OV.start_meter, OV.end_meter, organization_type_name, OV.organization_name, bf_organization_name, d_organization_name, OV.location, OV.purpose, OV.outcome, OV.contact_person, OV.contact_number, OV.latitude, OV.longitude ORDER BY OV.id DESC", [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}

Profile.dealerStocks = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query("SELECT OV.id as organizational_visit_id, user.name as officer_name, DATE_FORMAT(OV.date, '%Y-%m-%d') as date, DATE_FORMAT(OV.sys_date, '%Y-%m-%d %H:%I:%S') as sys_date, OV.organization_name, O.name as bf_organization_name, D.name as d_organization_name, model.name as model_name, chassis_no FROM organizational_visit_stock OVS LEFT JOIN organizational_visit OV ON OVS.organizational_visit_id = OV.id LEFT JOIN dealer D ON OV.organization_name_fk = D.id AND OV.organization_type_id IN (6, 7) AND OV.organization_name_fk <> 0 LEFT JOIN organization O ON OV.organization_name_fk = O.id AND OV.organization_type_id IN (1, 2) AND OV.organization_name_fk <> 0 LEFT JOIN model ON OVS.model_id = model.id LEFT JOIN user ON OV.officer = user.username WHERE OV.officer = ? AND DATE(OV.sys_date) BETWEEN ? AND ? ORDER BY organizational_visit_id DESC;", [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}

Profile.dealerInquiries = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query("SELECT OVI.organizational_visit_id, DATE_FORMAT(OV.date, '%Y-%m-%d') as date, DATE_FORMAT(OV.sys_date, '%Y-%m-%d %H:%I:%S') as sys_date, user.name as officer_name, OVI.customer_name, OVI.customer_telephone, OVI.customer_nic, OVI.customer_address, OVI.inquiry, OV.organization_name, O.name as bf_organization_name, D.name as d_organization_name, model.name as model_name FROM organizational_visit_inquiry OVI LEFT JOIN model ON OVI.model = model.id LEFT JOIN organizational_visit OV ON OVI.organizational_visit_id = OV.id LEFT JOIN dealer D ON OV.organization_name_fk = D.id AND OV.organization_type_id IN (6, 7) AND OV.organization_name_fk <> 0 LEFT JOIN organization O ON OV.organization_name_fk = O.id AND OV.organization_type_id IN (1, 2) AND OV.organization_name_fk <> 0 LEFT JOIN user ON OV.officer = user.username WHERE OV.officer = ? AND DATE(OV.sys_date) BETWEEN ? AND ? ORDER BY OVI.organizational_visit_id DESC;", [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}

Profile.fieldVisits = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query("SELECT FV.id, DATE_FORMAT(FV.date, '%Y-%m-%d') as date, DATE_FORMAT(FV.sys_date, '%Y-%m-%d %H:%I:%S') as sys_date, user.name as officer_name, FV.start_meter, FV.end_meter, FV.location, FVC.name as field_visit_criteria FROM field_visit FV LEFT JOIN field_visit_criteria FVC ON FV.field_visit_criteria_id = FVC.id LEFT JOIN user ON FV.officer = user.username WHERE FV.officer = ? AND DATE(FV.sys_date) BETWEEN ? AND ? ORDER BY FV.id DESC;", [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}

Profile.fieldVisitInquiries = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query("SELECT FVI.field_visit_id, DATE_FORMAT(FV.sys_date, '%Y-%m-%d %H:%I:%S') as sys_date, FVI.customer_name, FVI.customer_address, FVI.customer_telephone, FVI.customer_nic, FVI.inquiry, model.name as model_name, FV.location FROM field_visit_inquiry FVI LEFT JOIN field_visit FV ON FVI.field_visit_id = FV.id LEFT JOIN model ON FVI.model = model.id WHERE FV.officer = ? AND DATE(FV.sys_date) BETWEEN ? AND ? ORDER BY FVI.field_visit_id DESC;", [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                callback(err, rows)
            }
        })
    })
}
