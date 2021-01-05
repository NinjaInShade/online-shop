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
    if (!this.id) {
      this.id = Math.random().toString();

      get_products_from_file((products) => {
        products.push(this);
        fs.writeFile(f, JSON.stringify(products), (err) => {
          console.log(err);
        });
      });
    } else {
      // Admin is trying to edit existing product.
      get_products_from_file((products) => {
        // Create a new array which will be the updated array with the newly updated product. Find the index of the product.
        let updated_products = [...products];
        const existing_product_index = updated_products.findIndex((product) => product.id === this.id);

        // Update
        updated_products[existing_product_index] = this;

        fs.writeFile(f, JSON.stringify(updated_products), (err) => {
          console.log(err);
        });
      });
    }
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
