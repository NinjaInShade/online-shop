const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const products_controller = require("../../controllers/mongo/products");
const is_auth = require("../../util/is_auth");

// POST Routes
router.post(
  "/add-product",
  [
    check("title").trim().isLength({ min: 2 }).withMessage("Title must have 2 letters"),
    check("description").trim().isLength({ min: 8, max: 400 }).withMessage("Description must have atleast 8 letters."),
    check("price").trim().isFloat().withMessage("Price must be a number"),
  ],
  products_controller.post_add_product
);

router.post(
  "/edit-product/:productID",
  [
    check("title").trim().isLength({ min: 2 }).withMessage("Title must have 2 letters"),
    check("description").trim().isLength({ min: 8, max: 400 }).withMessage("Description must have atleast 8 letters."),
    check("price").trim().isFloat().withMessage("Price must be a number"),
  ],
  products_controller.post_edit_product
);

router.delete("/delete-product/:productID", products_controller.delete_product);

module.exports = {
  routes: router,
};
