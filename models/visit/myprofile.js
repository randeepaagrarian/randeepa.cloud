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
        connection.query('SELECT OV.id, DATE_FORMAT(OV.date, \'%Y-%m-%d\') as date, DATE_FORMAT(OV.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, OV.officer, U.name as officer_name, R.name as region_name, T.name as territory_name, OV.start_meter, OV.end_meter, OT.name as organization_type_name, OV.organization_name, O.name as bf_organization_name, D.name as d_organization_name, COUNT(OS.id) as stocks, COUNT(OI.id) as inquiries, OV.location, OV.purpose, OV.outcome, OV.contact_person, OV.contact_number, OV.latitude, OV.longitude FROM organizational_visit OV LEFT JOIN organizational_visit_stock OS ON OV.id = OS.organizational_visit_id LEFT JOIN organizational_visit_inquiry OI ON OV.id = OI.organizational_visit_id LEFT JOIN region R ON OV.region = R.id LEFT JOIN territory T ON OV.territory = T.id LEFT JOIN user U ON OV.officer = U.username LEFT JOIN organization_type OT ON OV.organization_type_id = OT.id LEFT JOIN organization O ON OV.organization_name_fk = O.id AND OV.organization_type_id IN (1, 2) AND OV.organization_name_fk <> 0 LEFT JOIN dealer D ON OV.organization_name_fk = D.id AND OV.organization_type_id IN (6, 7) AND OV.organization_name_fk <> 0 WHERE OV.officer = ? GROUP BY OV.id, date, sys_date, officer_name, region_name, territory_name, OV.start_meter, OV.end_meter, organization_type_name, OV.organization_name, bf_organization_name, d_organization_name, OV.location, OV.purpose, OV.outcome, OV.contact_person, OV.contact_number, OV.latitude, OV.longitude ORDER BY OV.id DESC', user, function(err, rows) {
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
        connection.query('SELECT OV.id, DATE_FORMAT(OV.date, \'%Y-%m-%d\') as date, DATE_FORMAT(OV.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, OV.officer, U.name as officer_name, R.name as region_name, T.name as territory_name, OV.start_meter, OV.end_meter, OT.name as organization_type_name, OV.organization_name, O.name as bf_organization_name, D.name as d_organization_name, COUNT(OS.id) as stocks, COUNT(OI.id) as inquiries, OV.location, OV.purpose, OV.outcome, OV.contact_person, OV.contact_number, OV.latitude, OV.longitude FROM organizational_visit OV LEFT JOIN organizational_visit_stock OS ON OV.id = OS.organizational_visit_id LEFT JOIN organizational_visit_inquiry OI ON OV.id = OI.organizational_visit_id LEFT JOIN region R ON OV.region = R.id LEFT JOIN territory T ON OV.territory = T.id LEFT JOIN user U ON OV.officer = U.username LEFT JOIN organization_type OT ON OV.organization_type_id = OT.id LEFT JOIN organization O ON OV.organization_name_fk = O.id AND OV.organization_type_id IN (1, 2) AND OV.organization_name_fk <> 0 LEFT JOIN dealer D ON OV.organization_name_fk = D.id AND OV.organization_type_id IN (6, 7) AND OV.organization_name_fk <> 0 WHERE DATE(OV.sys_date) = ? AND OV.officer = ? GROUP BY OV.id, date, sys_date, officer_name, region_name, territory_name, OV.start_meter, OV.end_meter, organization_type_name, OV.organization_name, bf_organization_name, d_organization_name, OV.location, OV.purpose, OV.outcome, OV.contact_person, OV.contact_number, OV.latitude, OV.longitude ORDER BY OV.id DESC', [date, user], function(err, rows) {
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
