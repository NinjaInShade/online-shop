const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node_shop",
  password: process.env.DB_PASS,
});

module.exports = pool.promise();
