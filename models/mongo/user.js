const get_db = require("../../util/database").mongo_get_db;
const mongo_db = require("mongodb");

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = get_db();

    return db.collection("users").insertOne(this);
  }

  static findById(user_id) {
    const db = get_db();

    return db
      .collection("users")
      .find({ _id: new mongo_db.ObjectId(user_id) })
      .next();
  }
}

module.exports = User;
