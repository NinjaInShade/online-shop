exports.get404 = function unmatched_route_controller(req, res, next) {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: undefined, is_authenticated: req.is_authenticated });
};
