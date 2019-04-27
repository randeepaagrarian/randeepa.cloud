const MySql = require('../comms/mySqlCon')
const Sale = module.exports = {}

// Todal All System Date
Sale.sysToday = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE DATE(S.sys_date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', date, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

// Today All Actual Date
Sale.actToday = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE DATE(S.date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', date, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

// All
Sale.all = function(pageNumber, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        const offset = (pageNumber - 1) * 50

        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC LIMIT 50 offset ?', offset, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.actByDateAll = function(year, month, date, callback) {
    var paramDate = year + '-' + month + '-' + date
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0  LEFT JOIN user U ON S.officer = U.username LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE DATE(S.date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', paramDate, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByDateAll = function(year, month, date, callback) {
    var paramDate = year + '-' + month + '-' + date
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0  LEFT JOIN user U ON S.officer = U.username LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE DATE(S.sys_date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', paramDate, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.actByDateRegion = function(year, month, date, region, callback) {
    var paramDate = year + '-' + month + '-' + date
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE DATE(S.date) = ? AND S.region = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [paramDate, region], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByDateRegion = function(year, month, date, region, callback) {
    var paramDate = year + '-' + month + '-' + date
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE DATE(S.sys_date) = ? AND S.region = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [paramDate, region], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.actByDateOfficer = function(year, month, date, officer, callback) {
    var paramDate = year + '-' + month + '-' + date
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE DATE(S.date) = ? AND S.officer = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [paramDate, officer], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByDateOfficer = function(year, month, date, officer, callback) {
    var paramDate = year + '-' + month + '-' + date
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE DATE(S.sys_date) = ? AND S.officer = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [paramDate, officer], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.actByMonthAll = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.date) = ? AND MONTH(S.date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByMonthAll = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.sys_date) = ? AND MONTH(S.sys_date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.actByMonthRegion = function(year, month, region, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.date) = ? AND MONTH(S.date) = ? AND S.region = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, month, region], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByMonthRegion = function(year, month, region, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.sys_date) = ? AND MONTH(S.sys_date) = ? AND S.region = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, month, region], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.actByMonthOfficer = function(year, month, officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.date) = ? AND MONTH(S.date) = ? AND S.officer = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, month, officer], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByMonthOfficer = function(year, month, officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.sys_date) = ? AND MONTH(S.sys_date) = ? AND S.officer = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, month, officer], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.actByYearAll = function(year, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', year, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByYearAll = function(year, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.sys_date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', year, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.actByYearRegion = function(year, region, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.date) = ? AND S.region = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, region], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByYearRegion = function(year, region, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.sys_date) = ? AND S.region = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, region], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.actByYearOfficer = function(year, officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.date) = ? AND S.officer = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, officer], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByYearOfficer = function(year, officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE YEAR(S.sys_date) = ? AND S.officer = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [year, officer], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.searchByCloudId = function(cloudID, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }
      connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, M.name as model_name, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE S.id LIKE  \'%' + cloudID + '%\'  GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, model_name, S.verified, S.verified_by, verified_on ORDER BY id DESC', function(err, rows, fields) {
          connection.release()
          if(err) {
              return callback(err, null)
          }
          callback(err, rows)
      })
  })
}

Sale.searchByChassisNo = function(chassisNo, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }
      connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, M.name as model_name, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE S.chassis_no LIKE  \'%' + chassisNo + '%\' GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, model_name, S.verified, S.verified_by, verified_on ORDER BY id DESC', function(err, rows, fields) {
          connection.release()
          if(err) {
              return callback(err, null)
          }
          callback(err, rows)
      })
  })
}

Sale.cloudIDInfo = function(cloudID, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }
      connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, DT.name as dealer_territory, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN territory DT ON D.territory_id = DT.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE S.id=? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, dealer_territory, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [cloudID], function(err, rows, fields) {
          connection.release()
          if(err) {
              return callback(err, null)
          }
          callback(err, rows)
      })
  })
}

Sale.search = function(skw, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }
      connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, DT.name as dealer_territory, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN territory DT ON D.territory_id = DT.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE CONCAT(S.id, U.name, R.name, T.name, DATE_FORMAT(S.date, \'%Y-%m-%d\'), DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\'), S.location, D.name, DT.name, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name, S.invoice_no, S.price, ST.name, S.institute, S.advance) LIKE \'%' + skw + '%\' GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, dealer_territory, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', function(err, rows, fields) {
          connection.release()
          if(err) {
              return callback(err, null)
          }
          callback(err, rows)
      })
  })
}

Sale.getCommentNotifiers = function(callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('SELECT user.username FROM user_access LEFT JOIN user ON user_id = user.id WHERE access_layer_id = 12 AND access_level = 1', function(err, rows, fields) {
      connection.release()
      if(err) {
          return callback(err, null)
      }
      callback(err, rows)
    })
  })
}

Sale.addComment = function(comment, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('INSERT INTO sale_comment SET ?', comment, function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, false)
        }
        callback(err, true)
    })
  })
}

Sale.getComments = function(cloudID, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('SELECT SC.username, U.name, DATE_FORMAT(SC.date, \'%Y-%m-%d %H:%i:%S\') as date, SC.text, SC.attachment FROM sale_comment SC LEFT JOIN user U ON SC.username = U.username WHERE sale_id = ? ORDER BY SC.date DESC', cloudID, function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, null)
        }
        callback(err, rows)
    })
  })
}

Sale.verify = function(cloudID, user, datetime, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('UPDATE sale SET verified = 1, verified_by = ?, verified_on = ? WHERE id = ?', [user, datetime, cloudID], function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, false)
        }
        callback(err, true)
    })
  })
}

Sale.saleCompletedTypes = function(callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('SELECT id, name FROM sale_completed_type', function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, null)
        }
        callback(err, rows)
    })
  })
}

Sale.markComplete = function(complete, cloudID, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('UPDATE sale SET ? WHERE id = ?', [complete, cloudID], function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, false)
        }
        callback(err, true)
    })
  })
}

Sale.saleRawInfo = function(cloudID, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('SELECT * FROM sale WHERE id = ?', [cloudID], function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, null)
        }
        callback(err, rows)
    })
  })
}

Sale.edit = function(cloudID, newSale, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, null)
    }
    connection.query('UPDATE sale SET ? WHERE id = ?', [newSale, cloudID], function(err, rows, fields) {
        connection.release()
        if(err) {
            return callback(err, false)
        }
        callback(err, true)
    })
  })
}
