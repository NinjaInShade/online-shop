// This is the same functionality as server.js but all code, files and import relate to mongo db instead of the mysql database.
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const db = require("./util/database").mongo;
const User = require("./models/mongo/user");

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
  User.findById("6011c6150ec4798d1028924c")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Route middlewares
app.use("/admin", admin_routes.routes);
app.use(shop_routes.routes);

app.use(unmatched_route_controller.get404);

db(() => {
  User.findById("6011c6150ec4798d1028924c")
    .then((user) => {
      if (user) {
        return user;
      }

      const new_user = new User("Leon", "leon@gmail.com");

      new_user
        .save()
        .then((result) => console.log("created user"))
        .catch((err) => console.log(err));

      return;
    })
    .catch((err) => console.log(err));

  console.log("server started");
  app.listen(process.env.PORT);
});
