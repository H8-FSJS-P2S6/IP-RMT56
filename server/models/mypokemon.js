'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MyPokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Many-to-One: MyListPokemon -> MyList
      MyPokemon.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Many-to-One: MyListPokemon -> Pokemon
      MyPokemon.belongsTo(models.Pokemon, {
        foreignKey: "pokemonId",
        as: "pokemon",
      });
    }
  }
  MyPokemon.init(
    {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    pokemonId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Pokemons",
        key: "id",
      },
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'MyPokemon',
  });
  return MyPokemon;
};