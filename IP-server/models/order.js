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
      });

      // Order has many OrderCart entries (products in the order)
      Order.hasMany(models.OrderCart, {
        foreignKey: "OrderId",
      });
    }
  }

  Order.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false, // UserId is required
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      grossAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  return Order;
};
