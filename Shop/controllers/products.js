const Product = require("../models/Product");

// GET controllers

function get_admin_products(req, res, next) {
  Product.fetchAll()
    .then((result) => {
      res.render("admin/products", {
        prods: result[0],
        pageTitle: "Admin Products",
        path: "/admin/products",
        hasProducts: result[0].length > 0,
      });
    })
    .catch((err) => {
      console.log(err);
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

  Product.findById(parseInt(product_id))
    .then((result) => {
      if (!result[0][0]) {
        res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Product",
        path: `/products`,
        product: result[0][0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function get_products(req, res, next) {
  Product.findAll()
    .then((result) => {
      res.render("shop/product-list", {
        prods: result,
        pageTitle: "Products",
        path: "/products",
        hasProducts: result.length > 0,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function get_product_detail(req, res, next) {
  const product_id = req.params.productId;

  Product.findById(parseInt(product_id))
    .then((result) => {
      res.render("shop/product-detail", {
        pageTitle: "Product",
        path: `/products`,
        product: result[0][0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// POST controllers

function post_add_product(req, res, next) {
  const body = req.body;

  const title = body.title;
  const description = body.title;
  const price = body.price;
  const image_url = body.image_url;

  Product.create({
    title,
    description,
    price,
    image_url,
  })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
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
