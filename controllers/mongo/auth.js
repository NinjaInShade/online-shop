const User = require("../../models/mongo/user");
const bcrypt = require("bcryptjs");

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
  // Find user, if user found login (if not redirect and send error msg back to view), validate and set all auth states and metadata then redirect to some page.
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.redirect("/auth/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((do_match) => {
          if (do_match) {
            req.session.is_authenticated = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.log(err);
              }

              res.redirect("/");
            });
          }

          return res.redirect("/auth/login");
        })
        .catch((err) => {
          console.log(err);
          req.redirect("/auth/login");
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
      }
      // If doesn't, create a new user in db - hash password first.
      return bcrypt
        .hash(password, 12)
        .then((hashed_password) => {
          const new_user = new User({ name, email, password: hashed_password, cart: { items: [] } });

          return new_user.save();
        })
        .catch((err) => console.log(err));
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
