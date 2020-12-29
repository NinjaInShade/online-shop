const express = require("express");

const router = express.Router();
const products_controller = require("../controllers/products");

// GET Routes
router.get("/products", products_controller.get_admin_products);

router.get("/edit-product", products_controller.get_edit_product);

router.get("/add-product", products_controller.get_add_product);

// POST Routes
router.post("/add-product", products_controller.post_add_product);

module.exports = {
  routes: router,
};
