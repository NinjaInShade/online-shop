const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const admin_routes = require("./routes/admin");
const shop_routes = require("./routes/shop");
const unmatched_route_controller = require("./controllers/unmatched_route");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", admin_routes.routes);
app.use(shop_routes.routes);

app.use(unmatched_route_controller.get404);

app.listen(5000);
