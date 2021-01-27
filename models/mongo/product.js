const get_db = require("../../util/database").mongo_get_db;

class Product {
  constructor(title, description, price, image_url) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.image_url = image_url;
  }

  save() {
    const db = get_db();
    return db.collection("products").insertOne(this);
  }

  static findAll() {
    const db = get_db();
    return db.collection("products").find().toArray();
  }
}

module.exports = Product;
