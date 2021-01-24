const { Sequelize } = require("sequelize");
const MongoClient = require("mongodb").MongoClient;

const MySQL = new Sequelize("nodeshop", "root", process.env.SQL_DB_PASS, {
  host: "localhost",
  dialect: "mysql",
});

let _db;

const mongoDB = (callback) => {
  MongoClient.connect(
    `mongodb+srv://leon-michalak:${process.env.MONGO_PASSWORD}@mongoapp.puyp7.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const get_db = () => {
  if (_db) {
    return _db;
  }

  throw "no database found";
};

module.exports = {
  mongo: mongoDB,
  mongo_get_db: get_db,
  mysql: MySQL,
};
