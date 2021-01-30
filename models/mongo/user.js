const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  cart: {
    items: [
      {
        product_id: { type: mongoose.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
  },
});

userSchema.methods.add_to_cart = function (productID) {
  const cart_item_index = this.cart.items.findIndex((p) => p.product_id.toString() === productID.toString());

  if (cart_item_index !== -1) {
    this.cart.items[cart_item_index].quantity += 1;

    return this.save();
  } else {
    this.cart.items.push({ product_id: productID, quantity: 1 });

    return this.save();
  }
};

module.exports = mongoose.model("User", userSchema);
