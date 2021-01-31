const Product = require("../../models/mongo/Product");
const Order = require("../../models/mongo/Order");

// GET Reqs
function get_index(req, res, next) {
  Product.find()
    .then((result) => {
      res.render("shop/product-list", {
        prods: result,
        pageTitle: "Products",
        path: "/",
        hasProducts: result.length > 0,
        is_authenticated: req.session.is_authenticated,
      });
    })
    .catch((err) => {
      console.log(err);
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
        is_authenticated: req.session.is_authenticated,
      });
    })
    .catch((err) => console.log(err));
}

function get_checkout(req, res, next) {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    is_authenticated: req.session.is_authenticated,
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
        is_authenticated: req.session.is_authenticated,
      });
    })
    .catch((err) => console.log(err));
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
    .catch((err) => console.log(err));
}

function post_remove_cart(req, res, next) {
  const productID = req.params.productID;

  req.user
    .delete_from_cart(productID)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
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
      req.session.user.cart.items = [];
      return req.user.save();
    })
    .then((result) => {
      console.log("Successfully created order");
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
}

module.exports = { get_index, get_cart, get_checkout, get_orders, post_cart, post_remove_cart, post_create_order };
