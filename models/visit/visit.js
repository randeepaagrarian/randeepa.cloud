const MySql = require('../comms/mySqlCon')
const Visit = module.exports = {}

Visit.fieldVisits = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT field_visit.id, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%I:%S\') AS sys_date, officer, region, start_meter, end_meter, location, name FROM field_visit LEFT JOIN field_visit_criteria ON field_visit.field_visit_criteria_id = field_visit_criteria.id ORDER BY field_visit.id DESC;', function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Visit.fieldVisitsByDate = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT field_visit.id, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%I:%S\') AS sys_date, officer, region, start_meter, end_meter, location, name FROM field_visit LEFT JOIN field_visit_criteria ON field_visit.field_visit_criteria_id = field_visit_criteria.id WHERE DATE(sys_date) = ? ORDER BY field_visit.id DESC;', date, function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Visit.fieldVisitsByDateOfficer = function(date, officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT field_visit.id, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d %H:%I:%S\') AS sys_date, officer, region, start_meter, end_meter, location, name FROM field_visit LEFT JOIN field_visit_criteria ON field_visit.field_visit_criteria_id = field_visit_criteria.id WHERE DATE(sys_date)  = ? AND officer = ? ORDER BY field_visit.id DESC;', [date, officer], function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Visit.fieldVisitInquiries = function(fieldVisitId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT customer_name, customer_telephone, customer_nic, customer_address, name, inquiry FROM field_visit_inquiry LEFT JOIN model ON field_visit_inquiry.model = model.id WHERE field_visit_id = ?;', fieldVisitId, function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Visit.organizationalVisits = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select O.id, DATE_FORMAT(O.date, \'%Y-%m-%d\') as date, DATE_FORMAT(O.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, COUNT(OS.model_id) as stocks, O.location, O.purpose, O.contact_person, O.contact_number from organizational_visit O LEFT JOIN organization_type OT ON O.organization_type_id = OT.id LEFT JOIN organizational_visit_stock OS on O.id = OS.organizational_visit_id group by O.id, O.date, O.sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, O.location, O.purpose, O.contact_person, O.contact_number order by O.sys_date desc', function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Visit.organizationalVisitsByDate = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select O.id, DATE_FORMAT(O.date, \'%Y-%m-%d\') as date, DATE_FORMAT(O.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, COUNT(OS.model_id) as stocks, O.location, O.purpose, O.contact_person, O.contact_number from organizational_visit O LEFT JOIN organization_type OT ON O.organization_type_id = OT.id LEFT JOIN organizational_visit_stock OS on O.id = OS.organizational_visit_id where DATE(sys_date) = ? group by O.id, O.date, O.sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, O.location, O.purpose, O.contact_person, O.contact_number order by O.sys_date desc', date, function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Visit.organizationalVisitsByDateOfficer = function(date, officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select O.id, DATE_FORMAT(O.date, \'%Y-%m-%d\') as date, DATE_FORMAT(O.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, COUNT(OS.model_id) as stocks, O.location, O.purpose, O.contact_person, O.contact_number from organizational_visit O LEFT JOIN organization_type OT ON O.organization_type_id = OT.id LEFT JOIN organizational_visit_stock OS on O.id = OS.organizational_visit_id where DATE(sys_date) = ? and officer = ? group by O.id, O.date, O.sys_date, O.officer, O.region, O.start_meter, O.end_meter, OT.name, O.organization_name, O.location, O.purpose, O.contact_person, O.contact_number order by O.sys_date desc', [date, officer], function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Visit.organizationalVisitStocks = function(organizationalVisitId, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select name, chassis_no from organizational_visit_stock, model where organizational_visit_stock.model_id = model.id and organizational_visit_stock.organizational_visit_id = ?', organizationalVisitId, function(err, rows) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
