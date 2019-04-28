const mysql = require('mysql')

const MySql = module.exports = {}

const args = require('yargs').argv;

MySql.pool = mysql.createPool({
    host            :   args.dbIP,
    user            :   args.dbUser,
    multipleStatements: true,
    password        :   args.dbPass,
    timezone        :   'UTC',
    database        :   args.dbName,
    dateStrings     :   'date'
})
