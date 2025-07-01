// backend/db.js
const mysql = require('mysql2/promise'); // 修改为promise版本

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 自动建表逻辑
async function initialize() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255) DEFAULT ''
      )
    `);
    connection.release();
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

initialize();

module.exports = pool;