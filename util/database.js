const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");

const MySQL = new Sequelize("nodeshop", "root", process.env.SQL_DB_PASS, {
  host: "localhost",
  dialect: "mysql",
});

const mongoose_connection = () => {
  return mongoose.connect(
    `mongodb+srv://leon-michalak:${process.env.MONGO_PASSWORD}@mongoapp.puyp7.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
};

module.exports = {
  mongo: mongoose_connection,
  mysql: MySQL,
};
