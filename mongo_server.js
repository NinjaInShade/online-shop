// This is the same functionality as server.js but all code, files and import relate to mongo db instead of the mysql database.
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongo_store = require("connect-mongodb-session")(session);
require("dotenv").config();

const store = new mongo_store({
  uri: `mongodb+srv://leon-michalak:${process.env.MONGO_PASSWORD}@mongoapp.puyp7.mongodb.net/${process.env.MONGO_DB_NAME}`,
  collection: "sessions",
});

const app = express();
const db = require("./util/database").mongo;
const User = require("./models/mongo/user");

app.set("view engine", "ejs");
app.set("views", "views");

const admin_routes = require("./routes/mongo/admin");
const shop_routes = require("./routes/mongo/shop");
const auth_routes = require("./routes/mongo/auth");
const unmatched_route_controller = require("./controllers/mongo/unmatched_route");

// External middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store }));

app.use((req, res, next) => {
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Route middlewares
app.use("/auth", auth_routes.routes);
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
