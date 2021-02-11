const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const products_controller = require("../../controllers/mongo/products");
const is_auth = require("../../util/is_auth");

// GET Routes
router.get("/products", is_auth, products_controller.get_admin_products);

router.get("/edit-product/:productID", is_auth, products_controller.get_edit_product);

router.get("/add-product", is_auth, products_controller.get_add_product);

// POST Routes
router.post(
  "/add-product",
  is_auth,
  [
    check("title").trim().isLength({ min: 2 }).withMessage("Title must have 2 letters"),
    check("description").trim().isLength({ min: 8, max: 400 }).withMessage("Description must have atleast 8 letters."),
    check("price").trim().isFloat().withMessage("Price must be a number"),
  ],
  products_controller.post_add_product
);

router.post(
  "/edit-product/:productID",
  is_auth,
  [
    check("title").trim().isLength({ min: 2 }).withMessage("Title must have 2 letters"),
    check("description").trim().isLength({ min: 8, max: 400 }).withMessage("Description must have atleast 8 letters."),
    check("price").trim().isFloat().withMessage("Price must be a number"),
  ],
  products_controller.post_edit_product
);

router.post("/delete-product/:productID", is_auth, products_controller.post_delete_product);

module.exports = {
  routes: router,
};
