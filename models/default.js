const MySql = require('./comms/mySqlCon')
const Default = module.exports = {}

Default.getBirthDays = function(callback) {
    MySql.pool.getConnection(function(pool_err, connection) {
        if(pool_err) {
            return callback(pool_err, null)
        }
        connection.query('select name, timestampdiff(YEAR, birthday, CURDATE()) as age from user where MONTH(birthday) = MONTH(CURDATE()) and DAY(birthday) = DAY(CURDATE())', function(err, rows, fields) {
            connection.release()
            if(err) {
                return callback(err, null)
            } else {
                return callback(err, rows)
            }
        })
    })
}
