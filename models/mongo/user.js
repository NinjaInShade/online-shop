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
    const cart_product = this.cart.items.findIndex((item) => {
      return item._id === product._id;
    });

    if (cart_product === -1) {
      // Create new product
      return db
        .collection("users")
        .updateOne({ _id: new mongo_db.ObjectId(this._id) }, { $set: { cart: { items: [...this.cart.items, { ...product, quantity: 1 }] } } });
    } else {
      // Update quantity
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
