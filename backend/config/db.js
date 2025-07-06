const mysql = require('mysql2');
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'brayan',
  database: 'tecnologyhub'
});

conexion.connect(err => {
  if (err) {
    console.error('Error al conectar MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

module.exports = conexion;