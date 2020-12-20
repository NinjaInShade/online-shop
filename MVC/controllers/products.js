const products = [];

function get_add_product(req, res, next) {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
}

function post_add_product(req, res, next) {
  products.push({ title: req.body.title });
  res.redirect("/");
}

function get_products(req, res, next) {
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
}

module.exports = { products, get_add_product, post_add_product, get_products };
