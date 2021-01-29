const Product = require("../../models/mongo/Product");

// GET controllers

function get_admin_products(req, res, next) {
  Product.find()
    .then((result) => {
      res.render("admin/products", {
        prods: result,
        pageTitle: "Admin Products",
        path: "/admin/products",
        hasProducts: result.length > 0,
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

  Product.findById(product_id)
    .then((result) => {
      if (!result) {
        res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Product",
        path: `/admin/products`,
        product: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function get_products(req, res, next) {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        hasProducts: products.length > 0,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function get_product_detail(req, res, next) {
  const product_id = req.params.productId;

  Product.findById(product_id)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: "Product",
        path: `/products`,
        product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// POST controllers

function post_add_product(req, res, next) {
  const title = req.body.title;
  const image_url = req.body.image_url;
  const price = req.body.price;
  const description = req.body.description;

  const new_prod = new Product({ title, description, price, image_url });

  new_prod
    .save()
    .then((result) => {
      console.log("Created a product successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
}

function post_edit_product(req, res, next) {
  const productID = req.params.productID;
  const body = req.body;

  const title = body.title;
  const description = body.description;
  const price = body.price;
  const image_url = body.image_url;

  Product.updateOne({ _id: productID }, { title, description, price, image_url })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
}

function post_delete_product(req, res, next) {
  const productID = req.params.productID;

  Product.deleteOne({ _id: productID })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
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
