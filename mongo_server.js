// This is the same functionality as server.js but all code, files and import relate to mongo db instead of the mysql database.
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const db = require("./util/database").mongo;

app.set("view engine", "ejs");
app.set("views", "views");

const admin_routes = require("./routes/mongo/admin");
const shop_routes = require("./routes/mongo/shop");
const unmatched_route_controller = require("./controllers/mongo/unmatched_route");

// External middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // Set the req.user
  next();
});

// Route middlewares
app.use("/admin", admin_routes.routes);
app.use(shop_routes.routes);

app.use(unmatched_route_controller.get404);

db(() => {
  app.listen(5000);
});
