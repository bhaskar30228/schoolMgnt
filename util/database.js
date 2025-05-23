const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '9mq2vhvm',
  database: 'school'
});

module.exports = pool.promise(); 
