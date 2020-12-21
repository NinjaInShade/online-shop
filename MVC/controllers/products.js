const Product = require("../models/Product");

let all_products = Product.fetchAll();

function get_add_product(req, res, next) {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
}

function post_add_product(req, res, next) {
  let new_product = new Product(req.body.title);
  new_product.save();
  res.redirect("/");
}

function get_products(req, res, next) {
  res.render("shop", {
    prods: all_products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: all_products.length > 0,
    activeShop: true,
    productCSS: true,
  });
}

module.exports = { all_products, get_add_product, post_add_product, get_products };
