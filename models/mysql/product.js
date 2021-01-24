const Sequelize = require("sequelize");

const sequelize = require("../../util/database");
const User = require("./user");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  image_url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

module.exports = Product;
