const User = require("../../models/mongo/user");

const { validationResult } = require("express-validator");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });

            return res.status(200).json({
              error_message: undefined,
              token,
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

function post_reset(req, res, next) {
  const email = req.body.email;

  let user_id;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("Error occured", err);
      return res.status(500).json({
        error_message: "Generating token failed",
      });
    }

    const token = buffer.toString("hex");

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error_message: "No user with that email.",
          });
        }

        user_id = user._id;
        user.reset_token = token;
        user.reset_token_expiration = Date.now() + 1000 * 60 * 60;
        return user.save();
      })
      .then(() => {
        const msg = {
          from: "leonmichalak6@gmail.com",
          to: email,
          subject: "Reset password",
          text: "reset password",
          html: `<p>You requested to reset your password</p>
                <a href='https://onlineshop-430be.web.app/reset-confirm/${token}/${user_id}'>Click this link to reset.</a>
          `,
        };

        return sgMail.send(msg);
      })
      .then(() => {
        return res.status(200).json({
          message: "email sent successfully.",
        });
      })
      .catch((err) => {
        const error = new Error(`ERROR: ${err}, \nFinding a user operation failed.`);
        return next(error);
      });
  });
}

function post_new_password(req, res, next) {
  const password = req.body.newpassword;
  const user_id = req.body.user_id;
  const token = req.body.token;

  let reset_user;

  User.findOne({ reset_token: token, reset_token_expiration: { $gt: Date.now() }, _id: mongoose.Types.ObjectId(user_id) })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error_message: "invalid token",
        });
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
    .then(() => {
      return res.status(200).json({
        message: "password changed",
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding a user operation failed.`);
      return next(error);
    });
}

module.exports = {
  post_signup,
  post_login,
  post_reset,
  post_new_password,
};
