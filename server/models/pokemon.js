'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pokemon.hasMany(models.MyPokemon, {
        foreignKey: "pokemonId",
        as: "pokemons",
      });
    }
  }
  Pokemon.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image:{
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    effect: {
      type: DataTypes.STRING,
    },
    primary_attribute: {
      type: DataTypes.STRING,
    },
    abilities: { 
      type: DataTypes.JSONB,
    },
    height: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    strength: {
      type: DataTypes.INTEGER,
    },
    agility: {
      type: DataTypes.INTEGER,
    },
    lore: {
      type: DataTypes.TEXT,
    },
    min_level: {
      type: DataTypes.INTEGER,
    },
    max_level: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Pokemon',
  });
  return Pokemon;
};