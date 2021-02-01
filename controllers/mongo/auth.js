const User = require("../../models/mongo/user");

function get_login(req, res, next) {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    is_authenticated: req.session.is_authenticated,
  });
}

function get_signup(req, res, next) {
  res.render("auth/signup", {
    pageTitle: "Sign up",
    path: "/login",
    is_authenticated: req.session.is_authenticated,
  });
}

function post_login(req, res, next) {
  // Handle login, set all auth states and metadata then redirect to some page.
  User.findById("6014513725c460218c999ff1")
    .then((user) => {
      req.session.is_authenticated = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.log(err);
        }

        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
}

function post_signup(req, res, next) {
  res.redirect("/");
}

function post_logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }

    res.redirect("/");
  });
}

module.exports = {
  get_login,
  get_signup,
  post_signup,
  post_login,
  post_logout,
};
