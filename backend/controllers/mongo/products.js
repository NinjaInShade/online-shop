const Product = require("../../models/mongo/product");
const { delete_file } = require("../../util/file");
const { validationResult } = require("express-validator");

const items_per_page = 3;

// GET controllers
function get_products(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  let total_products;

  Product.find()
    .countDocuments()
    .then((num) => {
      total_products = num;

      return Product.find()
        .skip((page - 1) * items_per_page)
        .limit(items_per_page);
    })
    .then((products) => {
      res.status(200).json({
        products: products,
        pageData: {
          total_products,
          has_next_page: items_per_page * page < total_products,
          has_previous_page: page > 1,
          current_page: page,
          next_page: page + 1,
          previous_page: page - 1,
          highest_page: Math.ceil(total_products / items_per_page),
        },
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \Finding all products operation failed.`);
      return next(error);
    });
}

function get_product(req, res, next) {
  const product_id = req.params.productId;

  Product.findById(product_id)
    .then((product) => {
      res.status(200).json({
        product,
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \Finding a product operation failed.`);
      return next(error);
    });
}

// POST controllers

function post_add_product(req, res, next) {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);

  if (!image) {
    return res.status(422).json({
      error_message: "Attatched file is not an image or correct file format",
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error_message: errors.array()[0].msg,
    });
  }

  const image_url = image.path;

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
      res.status(200).json({
        message: "Product created successfully",
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \nCreating new product operation failed.`);
      return next(error);
    });
}

function post_edit_product(req, res, next) {
  const productID = req.params.productID;
  const body = req.body;

  const title = body.title;
  const description = body.description;
  const price = body.price;
  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(500).json({ error_message: "Invaid fields" });
  }

  Product.findById(productID)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;

      if (image) {
        delete_file(product.image_url);
        product.image_url = image.path;
      }

      return product.save().then((result) => {
        res.status(200).json({ message: "Product updated successfully" });
      });
    })
    .catch((err) => {
      const error = new Error(`ERROR: ${err}, \Updating a product operation failed.`);
      return next(error);
    });
}

function delete_product(req, res, next) {
  const productID = req.params.productID;

  Product.findOneAndDelete({ _id: productID }, (err, product) => {
    if (err) {
      const error = new Error(`ERROR: ${err}, \Deleting a product operation failed.`);
      return next(error);
    }

    delete_file(product.image_url);
  })
    .then((result) => {
      return res.status(200).json({ message: "Product deleted successfully." });
    })
    .catch((err) => {
      return res.status(500).json({ error_message: "Product deletion failed." });
    });
}

module.exports = {
  post_add_product,
  get_products,
  get_product,
  post_edit_product,
  delete_product,
};
