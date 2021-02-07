const Product = require("../../models/mongo/Product");
const { validationResult } = require("express-validator");

// GET controllers

function get_admin_products(req, res, next) {
  Product.find({ user_id: req.user._id })
    .populate("user_id")
    .then((result) => {
      res.render("admin/products", {
        prods: result,
        pageTitle: "Admin Products",
        path: "/admin/products",
        hasProducts: result.length > 0,
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding products operation failed.`);
      error.httpStatusCode(500);
      next(error);
    });
}

function get_add_product(req, res, next) {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    error_msg: req.flash("error"),
    input_fields: {
      title: "",
      description: "",
      price: "",
      image_url: "",
    },
    validation_errors: [],
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
        error_msg: req.flash("error"),
        input_fields: {
          title: result.title,
          description: result.description,
          price: result.price,
          image_url: result.image_url,
        },
        validation_errors: [],
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nFinding a product operation failed.`);
      error.httpStatusCode(500);
      next(error);
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
      const error = new Error(`ERROR: ${err}, \Finding all products operation failed.`);
      error.httpStatusCode(500);
      next(error);
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
      const error = new Error(`ERROR: ${err}, \Finding a product operation failed.`);
      error.httpStatusCode(500);
      next(error);
    });
}

// POST controllers

function post_add_product(req, res, next) {
  const title = req.body.title;
  const image_url = req.body.image_url;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      error_msg: errors.array()[0].msg,
      input_fields: {
        title: title,
        description: description,
        price: price,
        image_url: image_url,
      },
      validation_errors: errors.array(),
    });
  }

  const new_prod = new Product({
    title,
    description,
    price,
    image_url,
    user_id: req.user._id,
  });

  new_prod
    .save()
    .then((result) => {
      console.log("Created a product successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nCreating new product operation failed.`);
      error.httpStatusCode(500);
      next(error);
    });
}

function post_edit_product(req, res, next) {
  const productID = req.params.productID;
  const body = req.body;

  const user_id = req.body.user_id;
  const title = body.title;
  const description = body.description;
  const price = body.price;
  const image_url = body.image_url;

  if (req.user._id.toString() !== user_id.toString()) {
    return res.redirect("/");
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return Product.findOne({ _id: productID })
      .then((product) => {
        if (!product) {
          return res.redirect("/");
        }

        return res.status(422).render("admin/edit-product", {
          pageTitle: "Product",
          path: `/admin/products`,
          product: product,
          error_msg: errors.array()[0].msg,
          input_fields: {
            title: title,
            description: description,
            price: price,
            image_url: image_url,
          },
          validation_errors: errors.array(),
        });
      })
      .catch((err) => {
        const error = new Error(`ERROR: ${err}, \Finding a product operation failed.`);
        error.httpStatusCode(500);
        next(error);
      });
  }

  Product.updateOne({ _id: productID }, { title, description, price, image_url })
    .then(() => {
      console.log("Updated product successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \Updating a product operation failed.`);
      error.httpStatusCode(500);
      next(error);
    });
}

function post_delete_product(req, res, next) {
  const productID = req.params.productID;
  const user_id = req.body.user_id;

  if (req.user._id.toString() !== user_id.toString()) {
    return res.redirect("/");
  }

  Product.deleteOne({ _id: productID })
    .then((result) => {
      console.log("Deleted product successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \Deleting a product operation failed.`);
      error.httpStatusCode(500);
      next(error);
    });
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
