const MySql = require('../comms/mySqlCon')
const sale_SYSEDIT = module.exports = {}

sale_SYSEDIT.getAllSales = function(pageNumber, callback) {

  MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }

        const offset = (pageNumber - 1) * 50

      connection.query('SELECT id, location, location_fk FROM sale WHERE id <= 1374 LIMIT 100 offset ?', offset, function(err, rows, fields) {
          connection.release()
          if(err) {
              return callback(err, null)
          }
          callback(err, rows)
      })
  })
}

sale_SYSEDIT.update = function(saleID, dealerID, callback) {

  MySql.pool.getConnection(function(pool_err, connection) {
      if(pool_err) {
          return callback(pool_err, null)
      }

      connection.query('UPDATE sale SET location_fk = ? WHERE id = ?', [dealerID, saleID], function(err, rows, fields) {
          connection.release()
          if(err) {
              return callback(err, false)
          }
          callback(err, true)
      })
  })
}
