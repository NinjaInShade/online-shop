// This is the same functionality as server.js but all code, files and import relate to mongo db instead of the mysql database.
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const csrf = require("csurf");
const flash = require("connect-flash");
require("dotenv").config();

const file_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const file_filter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const mongo_store = require("connect-mongodb-session")(session);
const app = express();
const db = require("./util/database").mongo;
const User = require("./models/mongo/user");

const store = new mongo_store({
  uri: `mongodb+srv://leon-michalak:${process.env.MONGO_PASSWORD}@mongoapp.puyp7.mongodb.net/${process.env.MONGO_DB_NAME}`,
  collection: "sessions",
});

const csrf_protection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const admin_routes = require("./routes/mongo/admin");
const shop_routes = require("./routes/mongo/shop");
const auth_routes = require("./routes/mongo/auth");
const error_controller = require("./controllers/mongo/error");

// External middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: file_storage, fileFilter: file_filter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store }));

app.use(csrf_protection);
app.use(flash());

app.use((req, res, next) => {
  // If user not authed, their is no user to find so we skip setting req.user
  if (!req.session.is_authenticated) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.is_authenticated = req.session.is_authenticated;
  res.locals.csrf_token = req.csrfToken();

  next();
});

// Route middlewares
app.use("/auth", auth_routes.routes);
app.use("/admin", admin_routes.routes);
app.use(shop_routes.routes);

app.use("/500", error_controller.get500);
app.use(error_controller.get404);

// Error middleware
app.use((error, req, res, next) => {
  return res.redirect("/500");
});

db()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server started and database connection succeeded");
    });
  })
  .catch((err) => console.log(err));