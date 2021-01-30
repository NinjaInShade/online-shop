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

userSchema.methods.delete_from_cart = function (productID) {
  const updated_cart_items = this.cart.items.filter((item) => item.product_id.toString() !== productID.toString());

  this.cart.items = updated_cart_items;

  return this.save();
};

userSchema.methods.get_cart = function () {
  // return in format {total_price: ..., products: [...]}
  let total_price = 0;
  const products = [];

  return this.populate("cart.items.product_id")
    .execPopulate()
    .then((populated_user) => {
      for (product of populated_user.cart.items) {
        const prod = product.product_id;

        total_price += product.quantity * product.product_id.price;
        // I tried to do {...product.product_id, quantity: product.quantity} as the quantity isn't stored in the populated field, but the spread op also nested the product object again.
        products.push({
          _id: prod._id,
          title: prod.title,
          description: prod.title,
          price: prod.price,
          image_url: prod.image_url,
          user_id: prod.user_id,
          quantity: product.quantity,
        });
      }

      return { total_price, products };
    })
    .catch((err) => console.log(err));
};

module.exports = mongoose.model("User", userSchema);
