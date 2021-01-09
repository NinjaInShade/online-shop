const db = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
  constructor(title, description, price, image_url) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.image_url = image_url;
  }

  save() {
    return db.execute("INSERT INTO products (title, description, price, image_url) VALUES (?, ?, ?, ?)", [
      this.title,
      this.description,
      this.price,
      this.image_url,
    ]);
  }

  static delete(id) {
    // Read products. Find the product index. Pop of the product at that index, and re-write the products back to file.
    get_products_from_file((products) => {
      Cart.remove(id);

      const product_index = products.findIndex((prod) => prod.id === id);
      products.splice(product_index, 1);

      fs.writeFile(f, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
