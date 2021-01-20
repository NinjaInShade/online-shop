const express = require("express");

const products_controller = require("../controllers/products");
const shop_controller = require("../controllers/shop");

const router = express.Router();

// GET Routes
router.get("/", shop_controller.get_index);

router.get("/products", products_controller.get_products);

router.get("/products/:productId", products_controller.get_product_detail);

router.get("/cart", shop_controller.get_cart);

router.get("/checkout", shop_controller.get_checkout);

router.get("/orders", shop_controller.get_orders);

// POST Routes
router.post("/cart", shop_controller.post_cart);

router.post("/create-order", shop_controller.post_create_order);

router.post("/delete-cart/:productID", shop_controller.post_remove_cart);

module.exports = {
  routes: router,
};
