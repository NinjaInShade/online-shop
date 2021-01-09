const Product = require("../models/Product");

// GET controllers

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
  const product_id = req.params.productID;

  Product.findById(product_id, (product) => {
    if (!product) {
      res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: `/admin/products`,
      product,
    });
  });
}

function get_products(req, res, next) {
  Product.fetchAll()
    .then((result) => {
      res.render("shop/product-list", {
        prods: result[0],
        pageTitle: "Products",
        path: "/products",
        hasProducts: result[0].length > 0,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function get_product_detail(req, res, next) {
  const product_id = req.params.productId;

  Product.findById(product_id, (product) => {
    res.render("shop/product-detail", {
      pageTitle: "Product",
      path: `/products`,
      product,
    });
  });
}

// POST controllers

function post_add_product(req, res, next) {
  const body = req.body;

  let new_product = new Product(null, body.title, body.description, body.price, body.imageUrl);
  new_product.save();
  res.redirect("/");
}

function post_edit_product(req, res, next) {
  const productID = req.params.productID;
  const body = req.body;

  let updated_product = new Product(productID, body.title, body.description, body.price, body.imageUrl);
  updated_product.save();

  res.redirect("/");
}

function post_delete_product(req, res, next) {
  const productID = req.params.productID;

  Product.delete(productID);

  res.redirect("/");
}

module.exports = {
  get_add_product,
  post_add_product,
  get_products,
  get_admin_products,
  get_product_detail,
  get_edit_product,
  post_edit_product,
  post_delete_product,
};
