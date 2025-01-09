"use strict";
const { Model } = require("sequelize");
const {hashPassword} = require("../helpers/hashPassword")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cart, {foreignKey: "userId"})
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      brand: DataTypes.STRING,
      type: DataTypes.STRING,
      price_range: {
        type: DataTypes.JSON,
        defaultValue: ""
      } 
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(user) {
          user.password = hashPassword(user.password); 
        },
      },
    }
  );
  return User;
};
