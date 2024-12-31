"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Order belongs to User
      Order.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "user", // Alias for the association
      });

      // Order has many OrderCart entries (products in the order)
      Order.hasMany(models.OrderCart, {
        foreignKey: "OrderId",
        as: "orderItems", // Alias for the association
      });
    }
  }

  Order.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false, // UserId is required
      },
      totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false, // Total price is required
      },
      orderStatus: {
        type: DataTypes.ENUM("pending", "completed", "cancelled"), // Define possible statuses
        allowNull: false,
        defaultValue: "pending", // Default value for order status
      },
      paymentStatus: {
        type: DataTypes.ENUM("unpaid", "paid", "failed"), // Define possible statuses
        allowNull: false,
        defaultValue: "unpaid", // Default value for payment status
      },
      paymentId: {
        type: DataTypes.STRING,
        allowNull: true, // Payment ID is optional
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  return Order;
};
