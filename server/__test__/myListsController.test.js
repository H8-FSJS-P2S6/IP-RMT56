const request = require("supertest");
const express = require("express");
const MyListController = require("../controllers/myListsController");
const { MyPokemon, Pokemon } = require("../models");

const app = express();
app.use(express.json());
app.post("/mypokemon", MyListController.createMyPokemon);
app.get("/mypokemons", MyListController.getMyPokemons);
app.get("/mypokemon/:id", MyListController.getMyPokemonById);
app.put("/mypokemon/:id", MyListController.updateMyPokemon);
app.delete("/mypokemon/:id", MyListController.deleteMyPokemon);

jest.mock("../models");

describe("MyListController", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: { id: 1 },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    describe("createMyPokemon", () => {
        it("should return 400 if pokemonId is not provided", async () => {
            req.body = {};
            await MyListController.createMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Pokemon ID is required" });
        });

        it("should return 400 if pokemon does not exist", async () => {
            req.body = { pokemonId: 1 };
            Pokemon.findByPk.mockResolvedValue(null);
            await MyListController.createMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Pokemon does not exist" });
        });

        it("should return 400 if pokemon is already in collection", async () => {
            req.body = { pokemonId: 1 };
            Pokemon.findByPk.mockResolvedValue({});
            MyPokemon.findOne.mockResolvedValue({});
            await MyListController.createMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Pokemon is already in your collection" });
        });

        it("should create a new pokemon entry", async () => {
            req.body = { pokemonId: 1 };
            Pokemon.findByPk.mockResolvedValue({});
            MyPokemon.findOne.mockResolvedValue(null);
            MyPokemon.create.mockResolvedValue({ id: 1 });
            MyPokemon.findOne.mockResolvedValue({ id: 1, pokemon: { id: 1, name: "Pikachu", url: "url" } });

            await MyListController.createMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, pokemon: { id: 1, name: "Pikachu", url: "url" } });
        });

        it("should return 500 if there is an error", async () => {
            req.body = { pokemonId: 1 };
            Pokemon.findByPk.mockRejectedValue(new Error("Error"));
            await MyListController.createMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });

    describe("getMyPokemons", () => {
        it("should return all pokemons for the user", async () => {
            MyPokemon.findAll.mockResolvedValue([{ id: 1, pokemon: { id: 1, name: "Pikachu", url: "url" } }]);
            await MyListController.getMyPokemons(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ id: 1, pokemon: { id: 1, name: "Pikachu", url: "url" } }]);
        });

        it("should return 500 if there is an error", async () => {
            MyPokemon.findAll.mockRejectedValue(new Error("Error"));
            await MyListController.getMyPokemons(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Error" });
        });
    });

    describe("getMyPokemonById", () => {
        it("should return the pokemon if found", async () => {
            req.params = { id: 1 };
            MyPokemon.findOne.mockResolvedValue({ id: 1, pokemon: { id: 1, name: "Pikachu", url: "url" } });
            await MyListController.getMyPokemonById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 1, pokemon: { id: 1, name: "Pikachu", url: "url" } });
        });

        it("should return 404 if pokemon not found", async () => {
            req.params = { id: 1 };
            MyPokemon.findOne.mockResolvedValue(null);
            await MyListController.getMyPokemonById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Pokemon not found or not owned by the user" });
        });

        it("should return 500 if there is an error", async () => {
            req.params = { id: 1 };
            MyPokemon.findOne.mockRejectedValue(new Error("Error"));
            await MyListController.getMyPokemonById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Error" });
        });
    });

    describe("updateMyPokemon", () => {
        it("should return 400 if pokemonId is not provided", async () => {
            req.params = { id: 1 };
            req.body = {};
            await MyListController.updateMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Pokemon ID is required" });
        });

        it("should return 404 if pokemon not found", async () => {
            req.params = { id: 1 };
            req.body = { pokemonId: 1 };
            Pokemon.findByPk.mockResolvedValue(null);
            await MyListController.updateMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Pokemon not found" });
        });

        it("should return 404 if myPokemon not found", async () => {
            req.params = { id: 1 };
            req.body = { pokemonId: 1 };
            Pokemon.findByPk.mockResolvedValue({});
            MyPokemon.findOne.mockResolvedValue(null);
            await MyListController.updateMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "myPokemon not found or not owned by the user" });
        });

        it("should update the pokemon entry", async () => {
            req.params = { id: 1 };
            req.body = { pokemonId: 1 };
            Pokemon.findByPk.mockResolvedValue({});
            MyPokemon.findOne.mockResolvedValue({ id: 1 });
            MyPokemon.create.mockResolvedValue({ id: 1 });
            MyPokemon.findOne.mockResolvedValue({ id: 1, pokemon: { id: 1, name: "Pikachu", url: "url" } });

            await MyListController.updateMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 1, pokemon: { id: 1, name: "Pikachu", url: "url" } });
        });

        it("should return 500 if there is an error", async () => {
            req.params = { id: 1 };
            req.body = { pokemonId: 1 };
            Pokemon.findByPk.mockRejectedValue(new Error("Error"));
            await MyListController.updateMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });

    describe("deleteMyPokemon", () => {
        it("should return 404 if myPokemon not found", async () => {
            req.params = { id: 1 };
            MyPokemon.findOne.mockResolvedValue(null);
            await MyListController.deleteMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "MyPokemon not found or not owned by the user" });
        });

        it("should delete the pokemon entry", async () => {
            req.params = { id: 1 };
            MyPokemon.findOne.mockResolvedValue({ id: 1 });
            await MyListController.deleteMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it("should return 500 if there is an error", async () => {
            req.params = { id: 1 };
            MyPokemon.findOne.mockRejectedValue(new Error("Error"));
            await MyListController.deleteMyPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Error" });
        });
    });
});