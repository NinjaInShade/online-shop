const Product = require("../models/product");
const Cart = require("../models/cart");

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

  Cart.add(data.productID, data.productPrice);
  res.redirect("/cart");
}

function post_remove_cart(req, res, next) {
  const productID = req.params.productID;

  Cart.remove(productID);

  res.redirect("/");
}

module.exports = { get_index, get_cart, get_checkout, get_orders, post_cart, post_remove_cart };
