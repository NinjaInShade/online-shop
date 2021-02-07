function get404(req, res, next) {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: undefined });
}

function get500(req, res, next) {
  res.status(500).render("500.ejs", {
    pageTitle: "Error",
    path: undefined,
  });
}

module.exports = {
  get404,
  get500,
};
