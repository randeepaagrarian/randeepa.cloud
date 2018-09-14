const mysql = require('mysql')

const MySql = module.exports = {}

MySql.pool = mysql.createPool({
    host            :   '124.43.17.89',
    user            :   'raplapp',
    multipleStatements: true,
    password        :   'raplapp@123',
    timezone        :   'UTC',
    database        :   'global_sys_copy',
    connectionLimit :   15,
    queueLimit      :   30,
    acquireTimeout  :   1000000
})
