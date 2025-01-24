"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Category has many Products
      Category.hasMany(models.Product, {
        foreignKey: "CategoryId", // The column in Product that references Category
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Name is required
        unique: true, // Category name must be unique
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );

  return Category;
};
