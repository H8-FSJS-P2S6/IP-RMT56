const axios = require("axios");

class TestController {
  static async getTest(req, res, next) {
    try {
      const { page = 0, limit = 9, name = "" } = req.query;

      let apiUrl = `https://pokeapi.co/api/v2/version/`;
      let allPokemons = [];
      let pageCount = 0;

      while (apiUrl && pageCount < 75) {
        const { data } = await axios.get(apiUrl, {
          headers: {
            accept: "application/json",
          },
        });

        if (!data || !data.content || data.content.length === 0) break;

        allPokemons = [...allPokemons, ...data.content];

        apiUrl = data.pageable.nextPage;
        pageCount++;
      }

      if (allPokemons.length === 0) {
        return res.json({
          pokemons: [],
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0,
        });
      }

      const filteredPokemons = name
        ? allPokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(name.toLowerCase())
          )
        : allPokemons;

      const formattedPokemons = filteredPokemons.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        url: pokemon.url,
      }));

      const total = formattedPokemons.length;
      const totalPages = Math.ceil(total / limit);

      const startIndex = page * limit;
      const endIndex = startIndex + limit;
      const pokemonsForPage = formattedPokemons.slice(startIndex, endIndex);

      return res.json({
        pokemons: pokemonsForPage,
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: totalPages,
        nextPage:
          page + 1 < totalPages ? `?page=${page + 1}&limit=${limit}` : null,
        previousPage: page > 0 ? `?page=${page - 1}&limit=${limit}` : null,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TestController;
