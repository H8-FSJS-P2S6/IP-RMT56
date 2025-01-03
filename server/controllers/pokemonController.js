const axios = require("axios");
const pokemon = require("../models/pokemon");


class pokemonController {
  static async getPokemons(req, res, next) {
    try {
      const { page = 1, limit = 9 } = req.query;
      const offset = (page - 1) * limit;

      const { data } = await axios({
        method: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`,
        headers: {
          accept: "application/json",
        },
      });

      if (!data || data.results.length === 0) {
        return res.json({
          pokemons: [],
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0,
        });
      }

      const total = data.count;
      const totalPages = Math.ceil(total / limit);

      const formattedPokemons = data.results.map((pokemon, index) => ({
        id: index + 1 + offset,
        name: pokemon.name,
        url: pokemon.url,
      }));

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
}

module.exports = pokemonController;
