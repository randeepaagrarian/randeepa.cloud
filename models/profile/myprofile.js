const MySql = require('../comms/mySqlCon')
const ProfileMyProfile = module.exports = {}

ProfileMyProfile.profile = function(username, start_date, end_date, callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }

        connection.query('CALL OfficerActivityLog(?, ?, ?);', [username, start_date, end_date], function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            }
            callback(err, rows)
        })
    })
}
