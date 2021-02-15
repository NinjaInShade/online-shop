const Product = require("../../models/mongo/Product");
const Order = require("../../models/mongo/Order");
const fs = require("fs");
const path = require("path");

// GET Reqs
function get_index(req, res, next) {
  Product.find()
    .then((result) => {
      res.render("shop/product-list", {
        prods: result,
        pageTitle: "Products",
        path: "/",
        hasProducts: result.length > 0,
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding a product operation failed.`);
      error.httpStatusCode(500);
      return next(error);
    });
}

function get_cart(req, res, next) {
  req.user
    .get_cart()
    .then((cart) => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        total_price: cart.total_price,
        products: cart.products,
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nGetting cart operation failed.`);
      error.httpStatusCode(500);
      return next(error);
    });
}

function get_checkout(req, res, next) {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
}

function get_orders(req, res, next) {
  let total_price = 0;

  Order.find({ user_id: req.user._id })
    .then((orders) => {
      for (let order of orders) {
        for (let order_item of order.products) {
          total_price += order_item.price * order_item.quantity;
        }
      }

      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders,
        total_price,
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding an order operation failed.`);
      error.httpStatusCode(500);
      return next(error);
    });
}

function get_invoice(req, res, next) {
  const order_id = req.params.orderId;

  const invoice_file = `invoice-${order_id}.pdf`;
  const invoice_path = path.join("data", "invoices", invoice_file);

  Order.findById(order_id)
    .then((order) => {
      if (!order) {
        return res.redirect("/orders");
      }

      if (order.user_id.toString() !== req.user._id.toString()) {
        return res.redirect("/orders");
      }
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding an order operation failed.`);
      error.httpStatusCode(500);
      return next(error);
    });

  // res.download(invoice_path);

  fs.readFile(invoice_path, (err, data) => {
    if (err) {
      return next(err);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${invoice_file}"`);
    res.send(data);
  });
}

// POST Reqs
function post_cart(req, res, next) {
  const productID = req.body.productID;

  // Get product info
  req.user
    .add_to_cart(productID)
    .then((result) => {
      console.log("Successfully added to cart");
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nAdding to cart operation failed.`);
      error.httpStatusCode(500);
      return next(error);
    });
}

function post_remove_cart(req, res, next) {
  const productID = req.params.productID;

  req.user
    .delete_from_cart(productID)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nRemoving from cart operation failed.`);
      error.httpStatusCode(500);
      return next(error);
    });
}

function post_create_order(req, res, next) {
  req.user
    .populate("cart.items.product_id")
    .execPopulate()
    .then((populated_user) => {
      const products = populated_user.cart.items.map((item) => {
        return { ...item.product_id._doc, quantity: item.quantity };
      });
      const order = new Order({ products, user_id: req.user._id });

      return order.save();
    })
    .then((result) => {
      req.user.cart.items = [];
      return req.user.save();
    })
    .then((result) => {
      console.log("Successfully created order");
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nCreating order operation failed.`);
      error.httpStatusCode(500);
      return next(error);
    });
}

module.exports = { get_index, get_cart, get_checkout, get_orders, post_cart, post_remove_cart, post_create_order, get_invoice };
