const { myPokemon, pokemon } = require("../models");

class MyListController {
  static async createMyPokemon(req, res) {
    const { pokemonId } = req.body;
    const userId = req.user.id;

    if (!pokemonId) {
      return res.status(400).json({ error: "Pokemon ID is required" });
    }

    try {
      const pokemon = await pokemon.findByPk(pokemonId);
      if (!pokemon) {
        return res.status(404).json({ error: "Pokemon not found" });
      }

      const existingEntry = await myPokemon.findOne({
        where: { userId, pokemonId },
      });

      if (existingEntry) {
        return res
          .status(400)
          .json({ error: "Pokemon already in your mine" });
      }

      const newEntry = await myPokemon.create({
        userId,
        pokemonId,
      });

      const createdEntry = await myPokemon.findOne({
        where: { id: newEntry.id },
        include: [
          {
            model: pokemon,
            as: "pokemons",
            attributes: ["id", "name", "url"],
          },
        ],
      });

      res.status(201).json(createdEntry);
    } catch (error) {
      console.error("Error adding pokemon to myPokemon:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getMyPokemons(req, res) {
    try {
      const userId = req.user.id;

      const pokemons = await pokemons.findAll({
        where: { userId },
        include: [
          {
            model: pokemon,
            as: "pokemons",
            attributes: ["id", "name", "url"],
          },
        ],
      });

      res.status(200).json(pokemons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMyPokemonById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const myPokemon = await myPokemon.findOne({
        where: { id, userId },
        include: [
          {
            model: pokemon,
            as: "pokemons",
            attributes: ["id", "name", "url"],
          },
        ],
      });

      if (!myPokemon) {
        return res
          .status(404)
          .json({ error: "Pokemon not found or not owned by the user" });
      }

      res.status(200).json(myPokemon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMyPokemon(req, res) {
    try {
      const { id } = req.params;
      const { pokemonId } = req.body;
      const userId = req.user.id;

      if (!pokemonId) {
        return res.status(400).json({ error: "Pokemon ID is required" });
      }

      const pokemon = await pokemon.findByPk(pokemonId);
      if (!pokemon) {
        return res.status(404).json({ error: "Pokemon not found" });
      }

      const myPokemon = await myPokemon.findOne({
        where: { id, userId },
      });

      if (!myPokemon) {
        return res
          .status(404)
          .json({ error: "myPokemon not found or not owned by the user" });
      }

      const existingEntry = await myPokemon.findOne({
        where: { myPokemonId: id, pokemonId },
      });

      if (existingEntry) {
        await myPokemon.destroy({
          where: { myPokemonId: id, pokemonId },
        });
      } else {
        await myPokemon.create({ myPokemonId: id, pokemonId });
      }

      const updatedMyPokemon = await myPokemon.findOne({
        where: { id },
        include: [
          {
            model: pokemon,
            as: "pokemons",
            attributes: ["id", "name", "url"],
          },
        ],
      });

      res.status(200).json(updatedMyPokemon);
    } catch (error) {
      console.error("Error updating myPokemon list:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteMyPokemon(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const myPokemon = await myPokemon.findOne({ where: { id, userId } });
      if (!myPokemon) {
        return res
          .status(404)
          .json({ error: "MyPokemon not found or not owned by the user" });
      }

      await myPokemon.destroy({ where: { id } });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MyListController;
