function get_login(req, res, next) {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
  });
}

module.exports = {
  get_login,
};
