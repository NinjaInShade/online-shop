const express = require("express");

const router = express.Router();
const products_controller = require("../controllers/products");

// /admin/add-product => GET
router.get("/add-product", products_controller.get_add_product);

// /admin/add-product => POST
router.post("/add-product", products_controller.post_add_product);

module.exports = {
  routes: router,
  products: products_controller.products,
};
