module.exports = (req, res, next) => {
  if (!req.session.is_authenticated) {
    return res.status(401).json({
      error_message: "not authorized",
    });
  }

  next();
};
