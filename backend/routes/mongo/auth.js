const express = require("express");
const { check } = require("express-validator");

const auth_controller = require("../../controllers/mongo/auth");

const router = express.Router();

// GET Routes

// router.get("/reset/:token", auth_controller.get_new_password);

// router.get("/reset", auth_controller.get_reset);

// POST routes

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
    check("password").trim().isLength({ min: 6 }).withMessage("Password must have 6 characters"),
  ],
  auth_controller.post_login
);

router.post(
  "/signup",
  [
    check("name").trim().isLength({ min: 2 }).withMessage("Name must not be empty"),
    check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
    check("password").trim().isLength({ min: 6 }).withMessage("Password must have 6 characters"),
    check("confirmpassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords don't match");
        }

        return true;
      }),
  ],
  auth_controller.post_signup
);

router.post("/reset", auth_controller.post_reset);

router.post("/reset/new-password", auth_controller.post_new_password);

module.exports = {
  routes: router,
};
