const Product = require("../models/Product");

function get_admin_products(req, res, next) {
  // res.render("admin/products", {
  //   pageTitle: "Admin Products",
  //   path: "/admin/products",
  // });
  Product.fetchAll(function (data) {
    res.render("admin/products", {
      prods: data,
      pageTitle: "Admin Products",
      path: "/admin/products",
      hasProducts: data.length > 0,
    });
  });
}

function get_add_product(req, res, next) {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
}

function get_edit_product(req, res, next) {
  res.render("/admin/edit-product", {
    pageTitle: "Edit product",
    path: "/admin/edit-product",
  });
}

function post_add_product(req, res, next) {
  const body = req.body;

  let new_product = new Product(body.title, body.description, body.price, body.imageUrl);
  new_product.save();
  res.redirect("/");
}

function get_products(req, res, next) {
  Product.fetchAll(function (data) {
    res.render("shop/product-list", {
      prods: data,
      pageTitle: "Products",
      path: "/products",
      hasProducts: data.length > 0,
    });
  });
}

function get_product_detail(req, res, next) {
  const product_id = req.params.productId;

  res.render("shop/product-detail", {
    pageTitle: "Product",
    path: "/product",
    productId: product_id,
  });
}

module.exports = { get_add_product, post_add_product, get_products, get_admin_products, get_product_detail, get_edit_product };
