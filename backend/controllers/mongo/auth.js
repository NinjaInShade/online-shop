const User = require("../../models/mongo/user");

const { validationResult } = require("express-validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GET reqs

function get_reset(req, res, next) {
  res.render("auth/reset_password", {
    pageTitle: "Reset password",
    path: "/login",
    error_msg: req.flash("error"),
  });
}

function get_new_password(req, res, next) {
  const token = req.params.token;

  User.findOne({ reset_token: token, reset_token_expiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        req.flash("error", "Token expired.");
        return res.redirect("/auth/reset");
      }

      res.render("auth/new_password", {
        pageTitle: "Reset password",
        path: "/login",
        error_msg: req.flash("error"),
        user_id: user._id.toString(),
        token,
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding a user operation failed.`);
      error.httpStatusCode(500);
      return next(error);
    });
}

// POST reqs

function post_login(req, res, next) {
  // Find user, if user found login (if not redirect and send error msg back to view), validate and set all auth states and metadata then redirect to some page.
  const email = req.body.email;
  const password = req.body.password;

  // Validate inputs
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error_message: errors.array()[0].msg,
      input_fields: {
        email,
        password,
      },
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error_message: "No user with that email",
        });
      }

      // Compare password entered to hash in db, if hash is valid user is loggd in.
      bcrypt
        .compare(password, user.password)
        .then((do_match) => {
          if (do_match) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

            return res
              .header("auth-token", token)
              .status(200)
              .json({
                error_message: undefined,
                user: { name: user.name, email: user.email, is_admin: user.is_admin, user_id: user._id, cart: user.cart },
                message: "User authenticated",
              });
          }

          return res.status(401).json({
            error_message: "Incorrect password",
          });
        })
        .catch((err) => {
          const error = new Error(`ERROR: ${err}, \nComparing password with hashed password operation failed.`);
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding a user operation failed.`);
      return next(error);
    });
}

function post_signup(req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const msg = {
    from: "leonmichalak6@gmail.com",
    to: email,
    subject: "Leons online shop",
    text: "Sign up",
    html: "<h1>You successfully signed up for my online shop!</h1>",
  };

  // Validate inputs
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error_message: errors.array()[0].msg,
    });
  }

  // Check if user exists
  User.findOne({ email })
    .then((user) => {
      // if exists send back bad response.
      if (user) {
        return res.status(409).json({
          error_message: "User already exists",
        });
      }

      // If doesn't, create a new user in db - hash password first.
      bcrypt
        .hash(password, 12)
        .then((hashed_password) => {
          const new_user = new User({ name, email, password: hashed_password, is_admin: false, cart: { items: [] } });

          return new_user.save();
        })
        .then(() => {
          return sgMail.send(msg);
        })
        .then(() => {
          // Everything valid, registration email sent, so create new user.
          return res.status(200).json({
            message: "User successfully created",
          });
        })
        .catch((err) => {
          const error = new Error(`ERROR: ${err}, \nHashing a password operation failed.`);
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding a user operation failed.`);
      return next(error);
    });
}

function post_logout(req, res, next) {
  return res.status(200).json({
    message: "User logged out",
  });
}

function post_reset(req, res, next) {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("Error occured", err);
      res.redirect("/auth/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No user for that email");
          return res.redirect("/auth/reset");
        }

        user.reset_token = token;
        user.reset_token_expiration = Date.now() + 1000 * 60 * 60;
        return user.save();
      })
      .then((result) => {
        const msg = {
          from: "leonmichalak6@gmail.com",
          to: email,
          subject: "Reset password",
          text: "reset password",
          html: `<p>You requested to reset your password</p>
                <a href='http://localhost:5000/auth/reset/${token}'>Click this link to reset.</a>
          `,
        };

        return sgMail.send(msg);
      })
      .then((result) => {
        return res.redirect("/auth/login");
      })
      .catch((err) => {
        const error = new Error(`ERROR: ${err}, \nFinding a user operation failed.`);
        error.httpStatusCode(500);
        return next(error);
      });
  });
}

function post_new_password(req, res, next) {
  const password = req.body.newpassword;
  const user_id = req.body.user_id;
  const token = req.body.token;

  let reset_user;

  User.findOne({ reset_token: token, reset_token_expiration: { $gt: Date.now() }, _id: user_id })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid token");
        return res.redirect(`/auth/reset/${token}`);
      }

      reset_user = user;

      return bcrypt.hash(password, 12);
    })
    .then((hashed_password) => {
      reset_user.password = hashed_password;
      reset_user.reset_token = undefined;
      reset_user.reset_token_expiration = undefined;

      return reset_user.save();
    })
    .then((result) => {
      return res.redirect("/auth/login");
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding a user operation failed.`);
      error.httpStatusCode(500);
      next(error);
    });
}

module.exports = {
  // get_login,
  // get_signup,
  // get_reset,
  // get_new_password,
  post_signup,
  post_login,
  post_logout,
  post_reset,
  post_new_password,
};
