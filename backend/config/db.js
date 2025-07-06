import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_SENA,
  database: process.env.DB_TECHNOLOGY_HUB,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONN_LIMIT || 10,
});