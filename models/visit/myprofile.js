const MySql = require('../comms/mySqlCon')
const VisitMyProfile = module.exports = {}

VisitMyProfile.fieldVisits = function(user, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT field_visit.id, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, officer, region, start_meter, end_meter, location, name FROM field_visit LEFT JOIN field_visit_criteria ON field_visit.field_visit_criteria_id = field_visit_criteria.id WHERE officer = ? ORDER BY field_visit.id DESC;', user, function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

VisitMyProfile.fieldVisitsByDate = function(date, user, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT field_visit.id, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, officer, region, start_meter, end_meter, location, name FROM field_visit LEFT JOIN field_visit_criteria ON field_visit.field_visit_criteria_id = field_visit_criteria.id WHERE DATE(sys_date)  = ? AND officer = ? ORDER BY field_visit.id DESC;', [date, user], function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

VisitMyProfile.fieldVisitInquiries = function(fieldVisitId, user, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT customer_name, customer_telephone, customer_nic, customer_address, name, inquiry, region FROM field_visit_inquiry LEFT JOIN model ON field_visit_inquiry.model = model.id LEFT JOIN field_visit ON field_visit_inquiry.field_visit_id = field_visit.id WHERE field_visit_id = ? AND officer = ?;', [fieldVisitId, user], function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

VisitMyProfile.organizationalVisits = function(user, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select O.id, DATE_FORMAT(O.date, \'%Y-%m-%d\') as date, DATE_FORMAT(O.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, COUNT(OS.model_id) as stocks, O.location, O.purpose, O.contact_person, O.contact_number from organizational_visit O LEFT JOIN organization_type OT ON O.organization_type_id = OT.id LEFT JOIN organizational_visit_stock OS on O.id = OS.organizational_visit_id where officer = ? group by O.id, O.date, O.sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, O.location, O.purpose, O.contact_person, O.contact_number order by O.sys_date desc', user, function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

VisitMyProfile.organizationalVisitsByDate = function(date, user, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select O.id, DATE_FORMAT(O.date, \'%Y-%m-%d\') as date, DATE_FORMAT(O.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, COUNT(OS.model_id) as stocks, O.location, O.purpose, O.contact_person, O.contact_number from organizational_visit O LEFT JOIN organization_type OT ON O.organization_type_id = OT.id LEFT JOIN organizational_visit_stock OS on O.id = OS.organizational_visit_id where DATE(sys_date) = ? and officer = ? group by O.id, O.date, O.sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, O.location, O.purpose, O.contact_person, O.contact_number order by O.sys_date desc', [date, user], function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

VisitMyProfile.organizationalVisitStocks = function(organizationalVisitId, user, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select M.name, chassis_no from organizational_visit_stock OVS, model M, organizational_visit OV, user U where OVS.model_id = M.id and OVS.organizational_visit_id = OV.id and OV.officer = U.username and OVS.organizational_visit_id = ? and OV.officer = ?', [organizationalVisitId, user], function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
