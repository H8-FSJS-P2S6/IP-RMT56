"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Product belongs to Category
      Product.belongsTo(models.Category, {
        foreignKey: "CategoryId", // The column in Product that references Category
        as: "category", // Alias for the association
      });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Name is required
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false, // Description is required
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false, // Price is required
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false, // Stock is required
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false, // Image URL is required
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false, // CategoryId is required
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
