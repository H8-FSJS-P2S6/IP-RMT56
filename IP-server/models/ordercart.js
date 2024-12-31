"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // OrderCart belongs to Order
      OrderCart.belongsTo(models.Order, {
        foreignKey: "OrderId", // The column in OrderCart that references the Order
        as: "order", // Alias for the association
      });

      // OrderCart belongs to Product
      OrderCart.belongsTo(models.Product, {
        foreignKey: "ProductId", // The column in OrderCart that references the Product
        as: "product", // Alias for the association
      });
    }
  }

  OrderCart.init(
    {
      OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false, // OrderId is required
      },
      ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false, // ProductId is required
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false, // Quantity is required
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false, // Price is required
      },
    },
    {
      sequelize,
      modelName: "OrderCart",
    }
  );

  return OrderCart;
};
