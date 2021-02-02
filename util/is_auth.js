module.exports = (req, res, next) => {
  if (!req.session.is_authenticated) {
    return res.redirect("/");
  }

  next();
};
