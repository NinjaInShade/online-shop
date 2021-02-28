const Product = require("../../models/mongo/Product");
const User = require("../../models/mongo/user");
const Order = require("../../models/mongo/Order");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const pdf_document = require("pdfkit");
const fs = require("fs");
const path = require("path");

// GET Reqs

function get_cart(req, res, next) {
  req.user
    .get_cart()
    .then((cart) => {
      res.status(200).json({
        products: cart.products,
        total_price: cart.total_price,
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nGetting cart operation failed.`);
      return next(error);
    });
}

function get_checkout(req, res, next) {
  let total_price;
  let products;

  req.user
    .get_cart()
    .then((cart) => {
      total_price = cart.total_price;
      products = cart.products;

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((prod) => {
          return {
            price_data: {
              currency: "gbp",
              product_data: {
                name: prod.title,
                description: prod.description,
              },
              unit_amount: parseInt(prod.price) * 100,
            },
            quantity: 1,
          };
        }),
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
        cancel_url: `${process.env.CLIENT_DOMAIN}cart`,
      });
    })
    .then((stripe_session) => {
      return res.status(200).json({
        session_id: stripe_session.id,
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nGetting cart operation failed.`);
      return next(error);
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

      let total_price = 0;

      const pdf_doc = new pdf_document();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoice_file}"`);

      pdf_doc.pipe(fs.createWriteStream(invoice_path));
      pdf_doc.pipe(res);

      pdf_doc.fontSize(35).text("Invoice file", { underline: true });
      pdf_doc.text("--------------");
      order.products.forEach((prod) => {
        total_price += prod.quantity * prod.price;
        pdf_doc.fontSize(24).text(`${prod.title} - £${prod.price} x ${prod.quantity}`);
      });

      pdf_doc.fontSize(28).text(`Total price: £${total_price}`);

      pdf_doc.end();
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding an order operation failed.`);
      return next(error);
    });
}

function get_user(req, res, next) {
  const user_id = req.params.user_id;

  User.findById(user_id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error_message: "No user found",
        });
      }

      req.session.is_authenticated = true;
      req.session.user = user;

      return res.status(200).json({
        user: { id: user._id, name: user.name, cart: user.cart, is_admin: user.is_admin },
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding a user operation failed.`);
      return next(error);
    });
}

// POST Reqs
function post_cart(req, res, next) {
  const productID = req.body.productID;

  // Get product info
  req.user
    .add_to_cart(productID)
    .then((result) => {
      res.status(200).json({ message: "Product successfully added to cart" });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nAdding to cart operation failed.`);
      return next(error);
    });
}

function post_remove_cart(req, res, next) {
  const productID = req.params.productID;

  req.user
    .delete_from_cart(productID)
    .then(() => {
      res.status(200).json({ message: "Cart item successfully deleted" });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nRemoving from cart operation failed.`);
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
      res.status(200).redirect(`${process.env.CLIENT_DOMAIN}profile`);
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nCreating order operation failed.`);
      return next(error);
    });
}

module.exports = { get_cart, get_checkout, get_orders, get_user, post_cart, post_remove_cart, post_create_order, get_invoice };
