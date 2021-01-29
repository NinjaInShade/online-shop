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
  User.findById("6014513725c460218c999ff1")
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

db()
  .then((result) => {
    return User.find();
  })
  .then((users) => {
    if (users.length === 0) {
      const new_user = new User({ name: "leon", email: "leon@gmail", cart: { items: [] } });
      new_user
        .save()
        .then((result) => {
          console.log("New user created");
        })
        .catch((err) => console.log(err));
    }

    app.listen(process.env.PORT, () => {
      console.log("Server started and database connection succeeded");
    });
  })
  .catch((err) => console.log(err));
