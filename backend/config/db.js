const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'brayan',
  database: 'tecnologyhub'
});

module.exports = pool.promise();