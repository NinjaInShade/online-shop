const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      product_data: Object,
      quantity: Number,
    },
  ],
  user_id: {
    type: mongoose.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Order", orderSchema);
