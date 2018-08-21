const mysql = require('mysql')

const MySql = module.exports = {}

MySql.pool = mysql.createPool({
    host            :   '124.43.17.89',
    user            :   'raplapp',
    password        :   'raplapp@123',
    timezone        :   'UTC',
    database        :   'global_sys',
    acquireTimeout  :   1000000
})
