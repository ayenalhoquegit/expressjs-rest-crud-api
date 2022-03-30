const mysql = require('mysql')
const dbConn = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:'',
    database:process.env.DB_DATABASE
})
// connect to database
dbConn.connect()

module.exports=dbConn