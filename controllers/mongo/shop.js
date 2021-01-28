const Product = require("../../models/mongo/product");
const User = require("../../models/mongo/User");

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
  let total_price = 0;

  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          for (let cart_item of products) {
            total_price += cart_item.price * cart_item.cartitem.quantity;
          }

          res.render("shop/cart", {
            pageTitle: "Cart",
            path: "/cart",
            total_price,
            products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function get_checkout(req, res, next) {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
}

function get_orders(req, res, next) {
  let total_price = 0;

  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      for (let order of orders) {
        for (let product of order.products) {
          total_price += product.price * product.orderitem.quantity;
        }
      }

      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders,
        total_price,
      });
    })
    .catch((err) => console.log(err));
}

// POST Reqs
function post_cart(req, res, next) {
  const productID = req.body.productID;
  let newQuantity = 1;

  // Get product info

  // Add product to users cart

  // Redirect to /cart
}

function post_remove_cart(req, res, next) {
  const productID = req.params.productID;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productID } });
    })
    .then((products) => {
      const product = products[0];

      return product.cartitem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
}

function post_create_order(req, res, next) {
  let fetched_cart;

  req.user
    .getCart()
    .then((cart) => {
      fetched_cart = cart;

      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderitem = { quantity: product.cartitem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      return fetched_cart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
}

module.exports = { get_index, get_cart, get_checkout, get_orders, post_cart, post_remove_cart, post_create_order };
