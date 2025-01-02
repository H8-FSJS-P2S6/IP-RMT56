const axios = require("axios");
const pokemon = require("../models/pokemon");


class pokemonController {
  static async getPokemons(req, res, next) {
    try {
      const { page = 1, limit = 9 } = req.query;
      const offset = (page - 1) * limit;

      const { data } = await axios({
        method: "GET",
        url: "https://pokeapi.co/api/v2/pokemon/",
        headers: {
          accept: "application/json",
        },
      });

      if (!data || data.length === 0) {
        return res.json({
          pokemons: [],
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0,
        });
      }

      const total = data.length;
      const totalPages = Math.ceil(total / limit);

      const paginatedData = data.slice(offset, offset + limit);

      const formattedPokemons = paginatedData.map((pokemon, index) => ({
        id: index + 1 + offset,
        name: pokemon.name,
        url: pokemon.url,
      }));
      console.log(data);

      return res.json({
        pokemons: formattedPokemons,
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: totalPages,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllPokemons(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 9;
      const offset = (page - 1) * limit;

      const totalPokemons = await pokemon.count();

      const pokemons = await pokemon.findAll({
        limit: limit,
        offset: offset,
      });

      const totalPages = Math.ceil(totalPokemons / limit);

      res.status(200).json({
        pokemons,
        totalPages,
        currentPage: page,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = pokemonController;
