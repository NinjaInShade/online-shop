const fs = require("fs");
const path = require("path");
const root_path = require("../util/path");

const f = path.join(root_path, "data", "products.json");

function get_products_from_file(cb) {
  fs.readFile(f, (err, file_content) => {
    if (err) {
      console.log(err, "fetching data error");
      return cb([]);
    }

    cb(JSON.parse(file_content));
  });
}

module.exports = class Product {
  constructor(id, title, description, price, imageUrl) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  save() {
    // If we dont have this product already, create new one
    get_products_from_file((products) => {
      const updated_products = [...products];
      const existing_product_index = updated_products.findIndex((product) => product.id === this.id);

      if (!this.id) {
        this.id = Math.random().toString();
        updated_products.push(this);
      } else {
        // Update
        updated_products[existing_product_index] = this;
      }

      fs.writeFile(f, JSON.stringify(updated_products), (err) => {
        console.log(err);
      });
    });
  }

  static delete(id) {
    // Read products. Find the product index. Pop of the product at that index, and re-write the products back to file.
    get_products_from_file((products) => {
      const product_index = products.findIndex((prod) => prod.id === id);
      products.splice(product_index, 1);

      fs.writeFile(f, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    get_products_from_file(cb);
  }

  static findById(id, cb) {
    get_products_from_file((data) => {
      // Filter out our product
      const product = data.find((prod) => prod.id === id);
      return cb(product);
    });
  }
};
