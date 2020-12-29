const Product = require("../models/Product");

function get_add_product(req, res, next) {
  res.render("admin/add-product", {
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
  Product.fetchAll(function (data) {
    res.render("shop/product-list", {
      prods: data,
      pageTitle: "Shop",
      path: "/",
      hasProducts: data.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
}

module.exports = { get_add_product, post_add_product, get_products };
