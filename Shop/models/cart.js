const fs = require("fs");
const path = require("path");
const root_path = require("../util/path");

const f = path.join(root_path, "data", "cart.json");

module.exports = class Cart {
  static findAll() {}

  static add(productID, productPrice) {
    // Fetch previous cart
    fs.readFile(f, (err, fileContent) => {
      let cart = { products: [], total_price: 0 };

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex((prod) => {
        return parseInt(prod.productID) === parseInt(productID);
      });

      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { productID, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.total_price = cart.total_price + parseInt(productPrice);
      fs.writeFile(f, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static remove(productID) {}
};
