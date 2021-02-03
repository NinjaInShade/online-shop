const express = require("express");

const auth_controller = require("../../controllers/mongo/auth");

const router = express.Router();

// GET Routes
router.get("/login", auth_controller.get_login);

router.get("/signup", auth_controller.get_signup);

router.get("/reset/:token", auth_controller.get_new_password);

router.get("/reset", auth_controller.get_reset);

// POST routes
router.post("/login", auth_controller.post_login);

router.post("/signup", auth_controller.post_signup);

router.post("/logout", auth_controller.post_logout);

router.post("/reset", auth_controller.post_reset);

router.post("/reset/new-password", auth_controller.post_new_password);

module.exports = {
  routes: router,
};
