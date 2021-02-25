const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image_url: String,
  user_id: {
    type: mongoose.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Product", productSchema);
