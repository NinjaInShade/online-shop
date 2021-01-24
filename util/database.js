// const { Sequelize } = require("sequelize");
const MongoClient = require("mongodb").MongoClient;

// MySQL Approach:
// const db = new Sequelize("nodeshop", "root", process.env.SQL_DB_PASS, {
//   host: "localhost",
//   dialect: "mysql",
// });

const db = (callback) => {
  MongoClient.connect(
    `mongodb+srv://leon-michalak:${process.env.MONGO_PASSWORD}@mongoapp.puyp7.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log("Connected");
      callback(client);
    })
    .catch((err) => console.log(err));
};

module.exports = db;
