const Product = require("../models/product");

// GET Reqs
function get_index(req, res, next) {
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

// POST Reqs
function post_cart(req, res, next) {
  const data = req.body;

  console.log(data);
  res.redirect("/cart");
}

module.exports = { get_index, get_cart, get_checkout, get_orders, post_cart };
