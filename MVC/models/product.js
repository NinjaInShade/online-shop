const fs = require("fs");
const path = require("path");
const root_path = require("../util/path");

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    const f = path.join(root_path, "data", "products.json");
    fs.readFile(f, (err, file_content) => {
      let products = [];

      if (!err) {
        products = JSON.parse(file_content);
      }

      products.push(this);
      fs.writeFile(f, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    const f = path.join(root_path, "data", "products.json");

    fs.readFile(f, (err, file_content) => {
      if (err) {
        console.log(err, "fetching data error");
        cb([]);
      }

      cb(JSON.parse(file_content));
    });
  }
};
