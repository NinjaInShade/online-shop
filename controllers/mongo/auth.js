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
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmed_password = req.body.confirmpassword;

  // Validate inputs

  // Check if user exists
  User.findOne({ email })
    .then((user) => {
      // if exists redirect back to signup form with error msgs.
      if (user) {
        return res.redirect("/auth/signup");
      } else {
        // If doesn't, create a new user in db.
        const new_user = new User({ name, email, password, cart: { items: [] } });

        return new_user.save();
      }
    })
    .then((result) => {
      // then redirect to login page for user to login.
      res.redirect("/auth/login");
    })
    .catch((err) => console.log(err));
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
