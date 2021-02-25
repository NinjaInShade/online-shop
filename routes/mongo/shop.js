const express = require("express");

const products_controller = require("../../controllers/mongo/products");
const shop_controller = require("../../controllers/mongo/shop");
const is_auth = require("../../util/is_auth");

const router = express.Router();

// GET Routes
router.get("/", shop_controller.get_index);

router.get("/products", products_controller.get_products);

router.get("/products/:productId", products_controller.get_product_detail);

router.get("/cart", is_auth, shop_controller.get_cart);

router.get("/checkout", is_auth, shop_controller.get_checkout);

router.get("/checkout/success", is_auth, shop_controller.post_create_order);

router.get("/checkout/cancel", is_auth, shop_controller.get_checkout);

router.get("/orders", is_auth, shop_controller.get_orders);

router.get("/orders/:orderId", is_auth, shop_controller.get_invoice);

// POST Routes
router.post("/cart", is_auth, shop_controller.post_cart);

router.post("/delete-cart/:productID", is_auth, shop_controller.post_remove_cart);

module.exports = {
  routes: router,
};
