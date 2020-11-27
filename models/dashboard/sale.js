const MySql = require('../comms/mySqlCon')
const Sales = module.exports = {}

Sales.topRegionsByMonth = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(*) AS sales, region, name FROM sale LEFT JOIN region ON sale.region = region.id WHERE deleted = 0 AND YEAR(sys_date) = ? AND MONTH(sys_date) = ? GROUP BY region, name ORDER BY sales DESC LIMIT 4;', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sales.topOfficersByMonth = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(*) AS sales, officer, user.name, sale.region, region.name AS region_name FROM sale LEFT JOIN user ON sale.officer = user.username LEFT JOIN region ON sale.region = region.id WHERE deleted = 0 AND YEAR(sys_date) = ? AND MONTH(sys_date) = ? GROUP BY officer, user.name, region, region.name ORDER BY sales DESC LIMIT 5;', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sales.byModelMonth = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(*) AS sales, name FROM sale LEFT JOIN model ON sale.model = model.id WHERE deleted = 0 AND YEAR(sys_date) = ? AND MONTH(sys_date) = ? GROUP BY model ORDER BY sales DESC;', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sales.byOfficerMonth = function(year, month, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT COUNT(*) AS sales, officer, user.name, sale.region, region.name AS region_name FROM sale LEFT JOIN user ON sale.officer = user.username LEFT JOIN region ON sale.region = region.id WHERE deleted = 0 AND  YEAR(sys_date) = ? AND MONTH(sys_date) = ? GROUP BY officer, user.name, region, region.name ORDER BY sales DESC;', [year, month], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sales.lastYear = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, COUNT(sales.id) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year FROM sale WHERE deleted = 0) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearCentral = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, COUNT(sales.id) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year FROM sale WHERE deleted = 0 AND  region = 20) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearRajarata = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, COUNT(sales.id) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year FROM sale WHERE deleted = 0 AND  region = 21) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearNorthWest = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, COUNT(sales.id) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year FROM sale WHERE deleted = 0 AND  region = 22) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearRuhuna = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, COUNT(sales.id) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year FROM sale WHERE deleted = 0 AND region = 23) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearIndustrial = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, COUNT(sales.id) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year FROM sale WHERE deleted = 0 AND region = 24) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearNorth = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, COUNT(sales.id) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year, price FROM sale WHERE deleted = 0 AND region = 25) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearByRevenue = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, SUM(sales.price) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year, price FROM sale WHERE deleted = 0) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearByRevenueCentral = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, SUM(sales.price) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year, price FROM sale WHERE deleted = 0 AND region = 20) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearByRevenueRajarata = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, SUM(sales.price) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year, price FROM sale WHERE deleted = 0 AND region = 21) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearByRevenueNorthWest = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, SUM(sales.price) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year, price FROM sale WHERE deleted = 0 AND  region = 22) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearByRevenueRuhuna = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, SUM(sales.price) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year, price FROM sale WHERE deleted = 0 AND  region = 23) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearByRevenueIndustrial = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, SUM(sales.price) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year, price FROM sale WHERE deleted = 0 AND  region = 24) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.lastYearByRevenueNorth = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('CALL Calendar(); SELECT CAL.month, CAL.year, SUM(sales.price) as sales FROM CAL LEFT JOIN ( SELECT id, MONTH(sys_date) AS month, YEAR(sys_date) as year, price FROM sale WHERE deleted = 0 AND  region = 25) sales ON sales.month = CAL.month AND sales.year = CAL.year GROUP BY month, year ORDER BY year ASC, month ASC',  function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows[2])
        })
    })
}

Sales.getOpenWatches = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT SW.id, SW.sale_id, content, date, due_date, DATEDIFF(NOW(), due_date) as expires FROM sale_watch SW WHERE SW.closed = -1 AND DATEDIFF(NOW(), due_date) >= 0;', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
      })
}


Sales.getModels = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM model', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sales.salesReportModelGroup = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM model_group', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}