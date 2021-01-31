const express = require("express");

const auth_controller = require("../../controllers/mongo/auth");

const router = express.Router();

// GET Routes
router.get("/login", auth_controller.get_login);

module.exports = {
  routes: router,
};
