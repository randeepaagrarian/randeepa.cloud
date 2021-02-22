const MySql = require('../comms/mySqlCon')
const Sale = module.exports = {}

// Todal All System Date
Sale.sysToday = function(date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE S.deleted = 0 AND  DATE(S.sys_date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', date, function(err, rows, fields) {
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
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE  S.deleted = 0 AND  DATE(S.date) = ? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', date, function(err, rows, fields) {
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

        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE  S.deleted = 0 GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC LIMIT 50 offset ?', offset, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByRangeAll = function(startDate, endDate, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query(`SELECT S.id, COUNT(SC.sale_id) as sale_comments, S.sale_completed, U.name as officer_name, R.name as region_name,model_group.name as model_group_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price as sale_price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on  FROM sale S 
        LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 
        LEFT JOIN user U ON S.officer = U.username  
        LEFT JOIN region R ON S.region = R.id 
        LEFT JOIN territory T ON S.territory = T.id 
        LEFT JOIN model M on S.model = M.id 
        LEFT JOIN model_group ON model_group.id = M.model_group_id 
        LEFT JOIN sale_type ST ON S.sale_type = ST.id 
        LEFT JOIN sale_comment SC ON SC.sale_id = S.id 
        LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id 
        WHERE  S.deleted = 0 AND  DATE(S.sys_date) BETWEEN ? AND ? 
        GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC;`, [startDate, endDate], function(err, rows, fields) {
           connection.release()    
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByRangeRegion = function(startDate, endDate, region, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query(`SELECT S.id, COUNT(SC.sale_id) as sale_comments, S.sale_completed, U.name as officer_name, R.name as region_name,model_group.name as model_group_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price as sale_price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on  FROM sale S 
        LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 
        LEFT JOIN user U ON S.officer = U.username  
        LEFT JOIN region R ON S.region = R.id 
        LEFT JOIN territory T ON S.territory = T.id 
        LEFT JOIN model M on S.model = M.id 
        LEFT JOIN model_group ON model_group.id = M.model_group_id 
        LEFT JOIN sale_type ST ON S.sale_type = ST.id 
        LEFT JOIN sale_comment SC ON SC.sale_id = S.id 
        LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id 
        WHERE  S.deleted = 0 AND  DATE(S.sys_date) BETWEEN ? AND ? And S.region = ?
        GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC;`, [startDate, endDate, region], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.sysByRangeOfficer = function(startDate, endDate, officer, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query(`SELECT S.id, COUNT(SC.sale_id) as sale_comments, S.sale_completed, U.name as officer_name, R.name as region_name,model_group.name as model_group_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price as sale_price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on  FROM sale S 
        LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 
        LEFT JOIN user U ON S.officer = U.username  
        LEFT JOIN region R ON S.region = R.id 
        LEFT JOIN territory T ON S.territory = T.id 
        LEFT JOIN model M on S.model = M.id 
        LEFT JOIN model_group ON model_group.id = M.model_group_id 
        LEFT JOIN sale_type ST ON S.sale_type = ST.id 
        LEFT JOIN sale_comment SC ON SC.sale_id = S.id 
        LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id 
        WHERE  S.deleted = 0 AND  DATE(S.sys_date) BETWEEN ? AND ? And S.officer  = ?
        GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC;`, [startDate, endDate, officer], function(err, rows, fields) {
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
      connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, M.name as model_name, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE  S.deleted = 0 AND  S.id LIKE  \'%' + cloudID + '%\'  GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, model_name, S.verified, S.verified_by, verified_on ORDER BY id DESC', function(err, rows, fields) {
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
      connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, M.name as model_name, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE  S.deleted = 0 AND  S.chassis_no LIKE  \'%' + chassisNo + '%\' GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, model_name, S.verified, S.verified_by, verified_on ORDER BY id DESC', function(err, rows, fields) {
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
      connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, DT.name as dealer_territory, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on, S.commision_paid, S.commission_paid_marked_by, S.commission_paid_marked_on, S.commission_paid_remarks FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN territory DT ON D.territory_id = DT.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE  S.deleted = 0 AND  S.id=? GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, dealer_territory, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [cloudID], function(err, rows, fields) {
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
    connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, DT.name as dealer_territory, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, M.model_group_id as modelGroupId, MG.name as model_group_name, S.invoice_no, S.price as sale_price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN territory DT ON D.territory_id = DT.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id LEFT JOIN model_group MG ON MG.id = M.model_group_id WHERE  S.deleted = 0 AND  CONCAT(S.id, U.name, R.name, T.name, DATE_FORMAT(S.date, \'%Y-%m-%d\'), DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\'), S.location, D.name, DT.name, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name, S.invoice_no, S.price, ST.name, S.institute, S.advance) LIKE \'%' + skw + '%\' GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, dealer_territory, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', function(err, rows, fields) {
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

Sale.addRegistration = function(cloudID, req_update, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('UPDATE sale_rmv SET ? WHERE sale_id = ?', [req_update, cloudID], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, false)
            }
            callback(err, true)
        })
      })
}

Sale.rmvSent = function(cloudID, user, datetime, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }
      connection.query('UPDATE sale_rmv SET documents_sent_to_rmv = 1, documents_sent_to_rmv_by = ?, documents_sent_to_rmv_on = ? WHERE sale_id = ?', [user, datetime, cloudID], function(err, rows, fields) {
          connection.release()
          if(err) {
              return callback(err, false)
          }
          callback(err, true)
      })
    })
  }

Sale.dsComplete = function(cloudID, user, datetime, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }
      connection.query('UPDATE sale_rmv SET document_set_complete = 1, document_set_completed_by = ?, document_set_completed_on = ? WHERE sale_id = ?', [user, datetime, cloudID], function(err, rows, fields) {
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

Sale.edit = function(cloudID, newSale, user, datetime, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
    if(pool_err) {
        return callback(pool_err, false)
    }

    connection.beginTransaction(function(err) {
      if(err) {
          connection.release()
          return callback(err, false)
      }

      connection.query('INSERT INTO sale_history (id, deleted, officer, region, territory, date, sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model, invoice_no, price, sale_type, institute, advance, latitude, longitude, location_fk, verified, verified_by, verified_on, sale_completed, sale_completed_type_id, sale_completed_remarks, sale_completed_by, sale_completed_on, commision_paid, commission_paid_remarks, commission_paid_marked_by, commission_paid_marked_on, date_in, modified_by) SELECT id, deleted, officer, region, territory, date, sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model, invoice_no, price, sale_type, institute, advance, latitude, longitude, location_fk, verified, verified_by, verified_on, sale_completed, sale_completed_type_id, sale_completed_remarks, sale_completed_by, sale_completed_on, commision_paid, commission_paid_remarks, commission_paid_marked_by, commission_paid_marked_on, ?, ? FROM sale WHERE id = ?', [datetime, user, cloudID], function(err, rows, fields) {

        if(err) {
            return connection.rollback(function() {
                connection.release()
                callback(err, false)
            })
        }

        connection.query('UPDATE sale SET ? WHERE id = ?', [newSale, cloudID], function(err, rows, fields) {
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

Sale.getSaleTypes = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM sale_type', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.getSaleCompletedTypes = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('SELECT * FROM sale_completed_type', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.getLogCurrent = function(cloudID, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }

      connection.query('SELECT id, \'current\' as status, \'\' as date_in, \'\' as modified_by, deleted, officer, region, territory, date, sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model, invoice_no, price, sale_type, institute, advance, latitude, longitude, location_fk, verified, verified_by, verified_on, sale_completed, sale_completed_type_id, sale_completed_remarks, sale_completed_by, sale_completed_on FROM sale WHERE id = ?', [cloudID], function(err, rows, fields) {
          connection.release()
          if(err) {
              return callback(err, null)
          }
          callback(err, rows)
      })
  })
}

Sale.getLogLogs = function(cloudID, callback) {
  MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }

      connection.query('SELECT id, \'log\' as status, date_in, modified_by, deleted, officer, region, territory, date, sys_date, location, chassis_no, customer_name, customer_address, customer_contact, model, invoice_no, price, sale_type, institute, advance, latitude, longitude, location_fk, verified, verified_by, verified_on, sale_completed, sale_completed_type_id, sale_completed_remarks, sale_completed_by, sale_completed_on FROM sale_history WHERE id = ? ORDER BY date_in DESC', [cloudID], function(err, rows, fields) {
          connection.release()
          if(err) {
              return callback(err, null)
          }
          callback(err, rows)
      })
  })
}

Sale.incompleteSales = function(startDate, endDate, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err){
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE  S.deleted = 0 AND  DATE(S.sys_date) BETWEEN ? AND ? AND S.sale_completed = 0 GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [startDate, endDate], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.searchSalesModelGroup = function(startDate, endDate, model, modelGroup, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err){
            return callback(pool_err, null)
        }

        if(model){

        }else{
            model = "NULL"
        } 
        
        if(modelGroup){

        }else{
            modelGroup = "NULL"
        }

        connection.query(`SELECT S.id, COUNT(SC.sale_id) as sale_comments, S.sale_completed, U.name as officer_name, R.name as region_name,model_group.name as model_group_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on 
        FROM sale S 
        LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 
        LEFT JOIN user U ON S.officer = U.username  
        LEFT JOIN region R ON S.region = R.id 
        LEFT JOIN territory T ON S.territory = T.id 
        LEFT JOIN model M on S.model = M.id 
        LEFT JOIN model_group ON model_group.id = M.model_group_id 
        LEFT JOIN sale_type ST ON S.sale_type = ST.id 
        LEFT JOIN sale_comment SC ON SC.sale_id = S.id 
        LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id 
        WHERE  S.deleted = 0 AND  DATE(S.sys_date) BETWEEN ? AND ? AND (NULLIF( ?, 'NULL') IS NULL OR M.id = ?) AND (NULLIF(?, 'NULL') IS NULL OR model_group.id = ?) 
        GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC;`, [startDate, endDate, model, model, modelGroup, modelGroup], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}


Sale.incompleteSalesHP = function(startDate, endDate, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err){
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE  S.deleted = 0 AND  DATE(S.sys_date) BETWEEN ? AND ? AND S.sale_type = ? AND S.sale_completed = 0 GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [startDate, endDate, 4], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.incompleteSalesExHP = function(startDate, endDate, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err){
            return callback(pool_err, null)
        }
        connection.query('SELECT S.id, COUNT(SC.sale_id) as sale_comments, U.name as officer_name, R.name as region_name, T.name as territory_name, DATE_FORMAT(S.date, \'%Y-%m-%d\') as date, DATE_FORMAT(S.sys_date, \'%Y-%m-%d %H:%i:%S\') as sys_date, S.location, D.name as sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, M.name as model_name, S.invoice_no, S.price, ST.name as sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, DATE_FORMAT(S.verified_on, \'%Y-%m-%d %H:%i:%S\') as verified_on, sale_completed, SCT.name as sale_completed_type_name, sale_completed_remarks, sale_completed_by, DATE_FORMAT(S.sale_completed_on, \'%Y-%m-%d %H:%i:%S\') as  sale_completed_on FROM sale S LEFT JOIN dealer D ON S.location_fk = D.id AND S.location_fk <> 0 LEFT JOIN user U ON S.officer = U.username  LEFT JOIN region R ON S.region = R.id LEFT JOIN territory T ON S.territory = T.id LEFT JOIN model M on S.model = M.id LEFT JOIN sale_type ST ON S.sale_type = ST.id LEFT JOIN sale_comment SC ON SC.sale_id = S.id LEFT JOIN sale_completed_type SCT ON SCT.id = S.sale_completed_type_id WHERE  S.deleted = 0 AND  DATE(S.sys_date) BETWEEN ? AND ? AND S.sale_type NOT IN (4) AND S.sale_completed = 0 GROUP BY S.id, officer_name, region_name, territory_name, date, sys_date, S.location, sd_location, S.location_fk, S.chassis_no, S.customer_name, S.customer_address, S.customer_contact, model_name, S.invoice_no, S.price, sale_type_name, S.institute, S.advance, S.latitude, S.longitude, S.verified, S.verified_by, verified_on ORDER BY S.id DESC', [startDate, endDate, 4], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}

Sale.addWatch = function(watch, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('INSERT INTO sale_watch SET ?', watch, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, false)
            }
            callback(err, true)
        })
    })
}

Sale.getOpenWatches = function(callback) {
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

Sale.getWatches = function(cloudID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT SW.id, content, date, due_date, DATEDIFF(NOW(), due_date) as expires, closed, U.name as closed_user FROM sale_watch SW LEFT JOIN user U ON SW.closed_by = U.username WHERE SW.sale_id = ?;', cloudID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
      })
}

Sale.getRMVDetails = function(cloudID, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT SR.document_set_complete, SR.document_set_completed_on, U1.name AS document_set_completed_by, SR.documents_sent_to_rmv, SR.documents_sent_to_rmv_on, U2.name AS documents_sent_to_rmv_by, SR.registered, SR.registered_date, SR.registered_number, SR.cr, SR.registered_added_on, U3.name AS registered_added_by, SR.cr_handed_over, SR.pronto_number, SR.pronto_date, SR.hand_over_person_responsible, SR.hand_over_remarks, SR.hand_over_added_on, U4.name AS hand_over_added_by, SR.customer_confirmation, SR.customer_remarks, SR.confirmation_added_on, U5.name AS confirmation_added_by FROM sale_rmv SR LEFT JOIN user U1 ON U1.username = SR.document_set_completed_by LEFT JOIN user U2 ON U2.username = SR.documents_sent_to_rmv_by LEFT JOIN user U3 ON U3.username = SR.registered_added_by LEFT JOIN user U4 ON U4.username = SR.hand_over_added_by LEFT JOIN user U5 ON U5.username = SR.confirmation_added_by WHERE SR.sale_id = ?;', cloudID, function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
      })
}

Sale.watchSucceeded = function(watchID, username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('UPDATE sale_watch SET closed = 0, closed_by = ? WHERE id = ?', [username, watchID], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, false)
            }
            callback(err, true)
        })
    })
}

Sale.watchFailed = function(watchID, username, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('UPDATE sale_watch SET closed = 1, closed_by = ? WHERE id = ?', [username, watchID], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, false)
            }
            callback(err, true)
        })
    })
}