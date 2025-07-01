const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'brayan',
  database: 'tecnologyhub2'
});

conexion.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a la BD MySQL');
});

module.exports = conexion;