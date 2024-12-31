"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Example of a one-to-many relationship with Cart
      // A User can have multiple Cart items
      User.hasMany(models.Cart, {
        foreignKey: "UserId",
        as: "carts",
      });

      // Example of a one-to-many relationship with Order
      // A User can have multiple Orders
      User.hasMany(models.Order, {
        foreignKey: "UserId",
        as: "orders",
      });
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure email is unique
        validate: {
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // Password is required
        validate: {
          len: {
            args: [6], // Password must be at least 6 characters long
            msg: "Password must be at least 6 characters long",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "Customer", // Default role is 'Customer'
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"), // Gender field as enum
        allowNull: true, // Allow null if you don't want to enforce gender
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
