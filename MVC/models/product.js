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
  constructor(title) {
    this.title = title;
  }

  save() {
    get_products_from_file((products) => {
      products.push(this);
      fs.writeFile(f, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    get_products_from_file(cb);
  }
};
