const express = require("express");

const auth_controller = require("../../controllers/mongo/auth");

const router = express.Router();

// GET Routes
router.get("/login", auth_controller.get_login);

// POST routes
router.post("/login", auth_controller.post_login);

router.post("/logout", auth_controller.post_logout);

module.exports = {
  routes: router,
};
