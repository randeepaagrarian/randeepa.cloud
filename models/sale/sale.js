const MySql = require('../comms/mySqlCon')
const Sale = module.exports = {}

// Todal All System Date
Sale.sysToday = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE DATE(S.sys_date) = ? ORDER BY S.id DESC', date, function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE DATE(S.date) = ? ORDER BY S.id DESC', date, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

// All
Sale.all = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id ORDER BY S.id DESC', function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0  LEFT JOIN user U ON S.officer = U.username LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE DATE(S.date) = ? ORDER BY S.id DESC', paramDate, function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0  LEFT JOIN user U ON S.officer = U.username LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE DATE(S.sys_date) = ? ORDER BY S.id DESC', paramDate, function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE DATE(S.date) = ? AND S.region = ? ORDER BY S.id DESC', [paramDate, region], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE DATE(S.sys_date) = ? AND S.region = ? ORDER BY S.id DESC', [paramDate, region], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE DATE(S.date) = ? AND S.officer = ? ORDER BY S.id DESC', [paramDate, officer], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE DATE(S.sys_date) = ? AND S.officer = ? ORDER BY S.id DESC', [paramDate, officer], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.date) = ? AND MONTH(S.date) = ? ORDER BY S.id DESC', [year, month], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.sys_date) = ? AND MONTH(S.sys_date) = ? ORDER BY S.id DESC', [year, month], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.date) = ? AND MONTH(S.date) = ? AND S.region = ? ORDER BY S.id DESC', [year, month, region], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.sys_date) = ? AND MONTH(S.sys_date) = ? AND S.region = ? ORDER BY S.id DESC', [year, month, region], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.date) = ? AND MONTH(S.date) = ? AND S.officer = ? ORDER BY S.id DESC', [year, month, officer], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.sys_date) = ? AND MONTH(S.sys_date) = ? AND S.officer = ? ORDER BY S.id DESC', [year, month, officer], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.date) = ? ORDER BY S.id DESC', year, function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.sys_date) = ? ORDER BY S.id DESC', year, function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.date) = ? AND S.region = ? ORDER BY S.id DESC', [year, region], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.sys_date) = ? AND S.region = ? ORDER BY S.id DESC', [year, region], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.date) = ? AND S.officer = ? ORDER BY S.id DESC', [year, officer], function(err, rows, fields) {
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
        connection.query('SELECT S.id, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%I:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%I:%S\') as verified_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id WHERE YEAR(S.sys_date) = ? AND S.officer = ? ORDER BY S.id DESC', [year, officer], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
