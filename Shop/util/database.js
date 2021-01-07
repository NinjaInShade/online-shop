const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node_shop",
  password: process.env["database_password"],
});

module.exports = pool.promise();
