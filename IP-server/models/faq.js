"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FAQ extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations if needed (for example, if you associate FAQ with other tables)
    }
  }

  FAQ.init(
    {
      question: {
        type: DataTypes.STRING,
        allowNull: false, // Ensure 'question' is required
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false, // Ensure 'answer' is required
      },
    },
    {
      sequelize,
      modelName: "FAQ",
    }
  );

  return FAQ;
};
