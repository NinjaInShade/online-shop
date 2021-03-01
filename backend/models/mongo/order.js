const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [Object],
    user_id: {
      type: mongoose.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Order", orderSchema);
