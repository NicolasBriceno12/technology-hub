import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();
export const pool = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
waitForConnections: true,
connectionLimit: process.env.DB_CONN_LIMIT || 10,
});
(async () => {
try {
const connection = await pool.getConnection();
console.log('✅ Conectado a la base de datos MySQL correctamente');
connection.release();
} catch (error) {
console.error('❌ Error al conectar a la base de datos:', error);
}
})();