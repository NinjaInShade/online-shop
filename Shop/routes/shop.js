const express = require("express");

const products_controller = require("../controllers/products");

const router = express.Router();

router.get("/", products_controller.get_products);

module.exports = {
  routes: router,
};
