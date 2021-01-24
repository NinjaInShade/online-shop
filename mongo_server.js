const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const db = require("./util/database");

app.set("view engine", "ejs");
app.set("views", "views");

// const admin_routes = require("./routes/admin");
// const shop_routes = require("./routes/shop");
const unmatched_route_controller = require("./controllers/unmatched_route");

// External middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // Set the req.user
});

// Route middlewares
// app.use("/admin", admin_routes.routes);
// app.use(shop_routes.routes);

app.use(unmatched_route_controller.get404);

db((client) => {
  app.listen(5000);
});
