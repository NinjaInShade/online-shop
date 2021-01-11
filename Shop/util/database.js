const { Sequelize } = require("sequelize");

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize("node_shop", "root", process.env.DB_PASS, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
