const pokemon = require("../models/pokemon");
const request = require("supertest");
const app = require("../app");

jest.mock("../models");

describe("GET /pokemons", () => {
  test("Success 200: Get all pokemons from database with pagination", async () => {
    pokemon.count.mockResolvedValue(10);
    pokemon.findAll.mockResolvedValue([
      {
        id: 1,
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon/1/",
      },
      {
        id: 2,
        name: "ivysaur",
        url: "https://pokeapi.co/api/v2/pokemon/2/"
      },
    ]);

    const res = await request(app).get("/pokemons").query({
      page: 1,
      limit: 2,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("pokemons");
    expect(res.body.pokemons).toHaveLength(2);
    expect(res.body.totalPages).toBe(5);
    expect(res.body.pokemons[0]).toHaveProperty("name", "bulbasaur");
  });

  test("Success 200: Empty response when no pokemons in database", async () => {
    pokemon.count.mockResolvedValue(0);
    pokemon.findAll.mockResolvedValue([]);

    const res = await request(app).get("/pokemons").query({
      page: 1,
      limit: 2,
    });

    expect(res.status).toBe(200);
    expect(res.body.pokemons).toHaveLength(0);
    expect(res.body.totalPages).toBe(0);
  });

  test("Failed 500: Internal server error when accessing database", async () => {
    pokemon.count.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/pokemons").query({
      page: 1,
      limit: 2,
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal Server Error");
  });
});
