require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.execute(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = { pool, query };
