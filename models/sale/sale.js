const MySql = require('../comms/mySqlCon')
const Sale = module.exports = {}

// Todal All System Date
Sale.sysToday = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE DATE(sys_date) = ? ORDER BY id ASC;', date, function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE DATE(date)  = ? ORDER BY id ASC;', date, function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id ORDER BY id DESC;', function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE DATE(date)  = ? ORDER BY id ASC;', paramDate, function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE DATE(sys_date)  = ? ORDER BY id ASC;', paramDate, function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE DATE(date)  = ? AND region = ? ORDER BY id ASC;', [paramDate, region], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE DATE(sys_date)  = ? AND region = ? ORDER BY id ASC;', [paramDate, region], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE DATE(date)  = ? AND officer = ? ORDER BY id ASC;', [paramDate, officer], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE DATE(sys_date)  = ? AND officer = ? ORDER BY id ASC;', [paramDate, officer], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(date) = ? AND MONTH(date) = ? ORDER BY id ASC;', [year, month], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(sys_date) = ? AND MONTH(sys_date) = ? ORDER BY id ASC;', [year, month], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(date) = ? AND MONTH(date) = ? AND region = ? ORDER BY id ASC;', [year, month, region], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(sys_date) = ? AND MONTH(sys_date) = ? AND region = ? ORDER BY id ASC;', [year, month, region], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(date) = ? AND MONTH(date) = ? AND officer = ? ORDER BY id ASC;', [year, month, officer], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(sys_date) = ? AND MONTH(sys_date) = ? AND officer = ? ORDER BY id ASC;', [year, month, officer], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(date) = ? ORDER BY id ASC;', year, function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, region, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(sys_date) = ? ORDER BY id ASC;', year, function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(date) = ? AND region = ? ORDER BY id ASC;', [year, region], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(sys_date) = ? AND region = ? ORDER BY id ASC;', [year, region], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(date) = ? AND officer = ? ORDER BY id ASC;', [year, officer], function(err, rows, fields) {
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
        connection.query('SELECT sale.id, officer, DATE_FORMAT(date, \'%Y-%m-%d\') AS date, DATE_FORMAT(sys_date, \'%Y-%m-%d\') AS sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model.name AS model_name, price, sale_type.name AS sale_type, institute, advance FROM sale LEFT JOIN model ON sale.model = model.id LEFT JOIN sale_type ON sale.sale_type =  sale_type.id WHERE YEAR(sys_date) = ? AND officer = ? ORDER BY id ASC;', [year, officer], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
