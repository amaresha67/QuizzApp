require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  multipleStatements: true,
});

connection.query(
  `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`,
  (err) => {
    if (err) throw err;
    console.log("✅ Database ensured.");

    connection.changeUser({ database: process.env.DB_NAME }, (err) => {
      if (err) throw err;

      const createTablesSQL = `
        CREATE TABLE IF NOT EXISTS principal (
          user_id INT NOT NULL PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          phone_number VARCHAR(20),
          password VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS teachers (
          teacher_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          email VARCHAR(100) NOT NULL UNIQUE,
          subject VARCHAR(50),
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          salary INT,
          gender VARCHAR(10),
          age INT,
          allow VARCHAR(20) DEFAULT 'no'
        );

        CREATE TABLE IF NOT EXISTS students (
          roll_number INT NOT NULL PRIMARY KEY,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          father_name VARCHAR(100),
          phone_number VARCHAR(20),
          email VARCHAR(100) NOT NULL UNIQUE,
          class VARCHAR(10),
          username VARCHAR(50),
          password VARCHAR(50),
          allow VARCHAR(20) DEFAULT 'no'
        );

        CREATE TABLE IF NOT EXISTS tests (
          test_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255),
          subject VARCHAR(255),
          class VARCHAR(10),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          duration VARCHAR(255),
          scheduled_at DATETIME
        );

        CREATE TABLE IF NOT EXISTS questionanswers (
          question_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          test_id INT,
          question VARCHAR(255),
          option_1 VARCHAR(255),
          option_2 VARCHAR(255),
          option_3 VARCHAR(255),
          option_4 VARCHAR(255),
          answer VARCHAR(255),
          FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS score (
          score_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          test_id INT,
          student_id INT,
          score INT,
          FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE SET NULL,
          FOREIGN KEY (student_id) REFERENCES students(roll_number) ON DELETE SET NULL
        );
      `;

      connection.query(createTablesSQL, (err) => {
        if (err) throw err;
        console.log("✅ Tables created or already exist.");

        // Now insert the principal if not exists
        const insertPrincipalSQL = `
          INSERT IGNORE INTO principal 
          (user_id, username, first_name, last_name, phone_number, password) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
          1,
          "Amaresha",
          "Amaresha",
          "hanumantraya",
          "9380624201",
          "Amaresha@123",
        ];

        connection.query(insertPrincipalSQL, values, (err) => {
          if (err) throw err;
          console.log(
            "✅ Default principal inserted (if not already present)."
          );

          connection.end();
        });
      });
    });
  }
);

module.exports = { connection };
