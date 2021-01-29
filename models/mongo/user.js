const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  cart: {
    items: [
      {
        product_id: mongoose.ObjectId,
        quantity: Number,
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
