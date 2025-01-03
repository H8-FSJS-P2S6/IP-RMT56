const { MyPokemon, pokemon } = require("../models");
const axios = require("axios");
class MyListController {
  static async createMyPokemon(req, res) {
    const { pokemonId } = req.body;
    const userId = req.user.id;

    if (!pokemonId) {
      return res.status(400).json({ error: "Pokemon ID is required" });
    }
    try {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      if (!data) {
        return res.status(404).json({ error: "Pokemon not found" });
      }
      const existingEntry = await MyPokemon.findOne({
        where: { userId, pokemonId },
      });

      if (existingEntry) {
        return res.status(400).json({ error: "Pokemon is already in your collection" });
      }
      const newEntry = await MyPokemon.create({
        userId,
        pokemonId,
      });

      const createdEntry = await MyPokemon.findOne({
        where: { id: newEntry.id },
        include: [
          {
            model: pokemon, 
            as: "pokemon",
            attributes: ["id", "name", "url"], 
          },
        ],
      });
      return res.status(201).json(createdEntry);
    } catch (error) {
      console.error("Error adding pokemon to MyPokemon:", error);

      if (error.response) {
        return res.status(500).json({ error: `External API error: ${error.message}` });
      } else if (error.request) {
        return res.status(500).json({ error: "No response received from the external API" });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
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

      const myPokemon = await MyPokemon.findOne({
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

      const myPokemon = await MyPokemon.findOne({
        where: { id, userId },
      });

      if (!myPokemon) {
        return res
          .status(404)
          .json({ error: "myPokemon not found or not owned by the user" });
      }

      const existingEntry = await MyPokemon.findOne({
        where: { MyPokemonId: id, pokemonId },
      });

      if (existingEntry) {
        await MyPokemon.destroy({
          where: { MyPokemonId: id, pokemonId },
        });
      } else {
        await MyPokemon.create({ MyPokemonId: id, pokemonId });
      }

      const updatedMyPokemon = await MyPokemon.findOne({
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

      const myPokemon = await MyPokemon.findOne({ where: { id, userId } });
      if (!myPokemon) {
        return res
          .status(404)
          .json({ error: "MyPokemon not found or not owned by the user" });
      }

      await MyPokemon.destroy({ where: { id } });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MyListController;
