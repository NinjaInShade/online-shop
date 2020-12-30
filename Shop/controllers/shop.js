const Product = require("../models/product");

function get_index(req, res, next) {
  // res.render("shop/index", {
  //   pageTitle: "Shop",
  //   path: "/",
  // });
  Product.fetchAll(function (data) {
    res.render("shop/product-list", {
      prods: data,
      pageTitle: "Shop",
      path: "/",
      hasProducts: data.length > 0,
    });
  });
}

function get_cart(req, res, next) {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
  });
}

function get_checkout(req, res, next) {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
}

function get_orders(req, res, next) {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
}

module.exports = { get_index, get_cart, get_checkout, get_orders };
