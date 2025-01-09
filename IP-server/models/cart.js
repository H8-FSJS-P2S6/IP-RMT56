"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Cart belongs to a User
      Cart.belongsTo(models.User, {
        foreignKey: "UserId",
      });

      // Cart belongs to a Product
      Cart.belongsTo(models.Product, {
        foreignKey: "ProductId",
      });
    }
  }

  Cart.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false, // UserId should not be null
      },
      ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false, // ProductId should not be null
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false, // Quantity cannot be null
        defaultValue: 1, // Default to 1 if no quantity is provided
      },
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );

  return Cart;
};
