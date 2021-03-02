const jwt = require("jsonwebtoken");
const User = require("../models/mongo/user");

module.exports = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({
      error_message: "not authorized",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    User.findById(verified._id)
      .then((user) => {
        req.user = user;

        return next();
      })
      .catch((err) => {
        const error = new Error(`ERROR: ${err}, \nFinding user failure.`);
        return next(error);
      });
  } catch (err) {
    return res.status(401).json({
      error_message: "not authorized",
    });
  }
};
