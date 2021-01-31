function get_login(req, res, next) {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    is_authenticated: req.is_authenticated,
  });
}

function post_login(req, res, next) {
  // Handle login then redirect to some page.
  req.is_authenticated = true;

  res.redirect("/");
}

module.exports = {
  get_login,
  post_login,
};
