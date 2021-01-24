const get_db = require("../../util/database").mongo_get_db;

const db = get_db();

class Product {
  constructor(title, description, price, image_url) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.image_url = image_url;
  }

  save() {
    console.log(db);
  }
}

module.exports = Product;
