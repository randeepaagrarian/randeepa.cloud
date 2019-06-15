const MySql = require('../comms/mySqlCon')
const MDate = require('../../functions/mdate')
const Service = module.exports = {}

Service.getTechnicians = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('SELECT username as id, name FROM user WHERE designation_fk = 3', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
