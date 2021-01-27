const get_db = require("../../util/database").mongo_get_db;
const mongo_db = require("mongodb");

class Product {
  constructor(title, description, price, image_url, _id) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.image_url = image_url;
    this._id = _id;
  }

  save() {
    const db = get_db();

    if (this._id) {
      // Update prod
      return db
        .collection("products")
        .updateOne(
          { _id: new mongo_db.ObjectId(this._id) },
          { $set: { title: this.title, description: this.description, price: this.price, image_url: this.image_url } }
        );
    } else {
      // Create new prod
      return db.collection("products").insertOne(this);
    }
  }

  static findAll() {
    const db = get_db();
    return db.collection("products").find().toArray();
  }

  static findByPk(product_id) {
    const db = get_db();

    return db
      .collection("products")
      .find({ _id: new mongo_db.ObjectId(product_id) })
      .next();
  }
}

module.exports = Product;
