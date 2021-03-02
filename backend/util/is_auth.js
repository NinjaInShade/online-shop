const jwt = require("jsonwebtoken");
const User = require("../models/mongo/user");

module.exports = (req, res, next) => {
  const token = req.header("authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error_message: "not authorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      return res.status(401).json({
        error_message: "not authorized",
      });
    }

    User.findById(decoded._id)
      .then((user) => {
        req.user = user;

        return next();
      })
      .catch((err) => {
        const error = new Error(`ERROR: ${err}, \nFinding user failure.`);
        return next(error);
      });
  });
};
