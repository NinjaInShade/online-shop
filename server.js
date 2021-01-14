const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const db = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const admin_routes = require("./routes/admin");
const shop_routes = require("./routes/shop");
const unmatched_route_controller = require("./controllers/unmatched_route");

// External middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Route middlewares
app.use("/admin", admin_routes.routes);
app.use(shop_routes.routes);

app.use(unmatched_route_controller.get404);

// Relate models
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// Below is not needed, just makes the relationship more clear
User.hasMany(Product);

// Sync db
db.sync()
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
