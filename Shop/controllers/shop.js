const Product = require("../models/product");
const Cart = require("../models/cart");

// GET Reqs
function get_index(req, res, next) {
  Product.findAll()
    .then((result) => {
      res.render("shop/product-list", {
        prods: result,
        pageTitle: "Products",
        path: "/",
        hasProducts: result.length > 0,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function get_cart(req, res, next) {
  Cart.getCart((cart) => {
    Product.fetchAll()
      .then((result) => {
        const cart_products = [];

        for (prod of result[0]) {
          const cart_prod = cart.products.find((product) => parseInt(product.productID) === prod.id);
          if (cart_prod) {
            cart_products.push({ ...prod, qty: cart_prod.qty });
          }
        }

        res.render("shop/cart", {
          pageTitle: "Cart",
          path: "/cart",
          total_price: cart.total_price,
          products: cart_products,
        });
      })
      .catch((err) => {
        console.log(err);
      });
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

  res.redirect("/cart");
}

module.exports = { get_index, get_cart, get_checkout, get_orders, post_cart, post_remove_cart };
