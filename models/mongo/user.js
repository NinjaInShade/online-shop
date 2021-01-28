const get_db = require("../../util/database").mongo_get_db;
const mongo_db = require("mongodb");

class User {
  constructor(name, email, cart, _id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // {items: [{prod_data, quantity}...]}
    this._id = _id;
  }

  save() {
    const db = get_db();

    return db.collection("users").insertOne(this);
  }

  add_to_cart(product) {
    const db = get_db();
    const existing_cart_product = this.cart.items.findIndex((item) => {
      return item.product_id.toString() === product._id.toString();
    });

    let updated_cart = { items: [...this.cart.items] };

    if (existing_cart_product === -1) {
      // Create new product
      updated_cart = { items: [...this.cart.items, { product_id: product._id, quantity: 1 }] };

      return db.collection("users").updateOne({ _id: new mongo_db.ObjectId(this._id) }, { $set: { cart: updated_cart } });
    } else {
      // Update quantity
      updated_cart.items[existing_cart_product] = {
        product_id: product._id,
        quantity: parseInt(updated_cart.items[existing_cart_product].quantity) + 1,
      };

      return db.collection("users").updateOne({ _id: new mongo_db.ObjectId(this._id) }, { $set: { cart: updated_cart } });
    }
  }

  static findById(user_id) {
    const db = get_db();

    return db
      .collection("users")
      .find({ _id: new mongo_db.ObjectId(user_id) })
      .next();
  }
}

module.exports = User;
