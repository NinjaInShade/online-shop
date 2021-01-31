function get_login(req, res, next) {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    is_authenticated: req.is_authenticated,
  });
}

function post_login(req, res, next) {
  // Handle login, set is auth state then redirect to some page.

  res.redirect("/");
}

module.exports = {
  get_login,
  post_login,
};
