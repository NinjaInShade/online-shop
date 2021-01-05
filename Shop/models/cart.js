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
        return prod.productID === productID;
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
        updatedProduct = { productID, price_for_one: parseInt(productPrice), qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.total_price = cart.total_price + parseInt(productPrice);

      fs.writeFile(f, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static remove(productID) {
    // Read all cart items. Find the product index with the correct productID. In a updated_items array add everything already in the cart.
    fs.readFile(f, (err, fileContent) => {
      if (err) {
        console.log(err);
      }

      const updated_cart = { ...JSON.parse(fileContent) };
      const existing_cart_index = updated_cart.products.findIndex((item) => item.productID === productID);

      // Update the item at the right index with one less quantity and reduce price if quantity > 1 otherwise delete it.
      updated_cart.products[existing_cart_index] = {
        ...updated_cart.products[existing_cart_index],
        qty: updated_cart.products[existing_cart_index].qty - 1,
      };

      // Update total price
      updated_cart.total_price = updated_cart.total_price - updated_cart.products[existing_cart_index].price_for_one;

      if (updated_cart.products[existing_cart_index].qty === 0) {
        updated_cart.products.splice(existing_cart_index, 1);
      }

      fs.writeFile(f, JSON.stringify(updated_cart), (err) => {
        console.log(err);
      });
    });
  }
};
