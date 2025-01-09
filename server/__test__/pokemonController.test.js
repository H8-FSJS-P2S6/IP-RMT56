const axios = require("axios");
const pokemonController = require("../controllers/pokemonController");
const { mockRequest, mockResponse, mockNext } = require("../utils/testUtils");

jest.mock("axios");

describe("pokemonController.getPokemons", () => {
    let req, res, next;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext();
    });

    it("should return paginated pokemons", async () => {
        req.query = { page: 1, limit: 9 };

        const mockData = {
            count: 1118,
            results: [
                { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
                { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
                // ... more mock pokemons
            ],
        };

        axios.mockResolvedValue({ data: mockData });

        await pokemonController.getPokemons(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            pokemons: [
                { id: 1, name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
                { id: 2, name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
                // ... more formatted pokemons
            ],
            page: 1,
            limit: 9,
            total: 1118,
            totalPages: Math.ceil(1118 / 9),
        });
    });

    it("should return empty array if no pokemons found", async () => {
        req.query = { page: 1, limit: 9 };

        const mockData = {
            count: 0,
            results: [],
        };

        axios.mockResolvedValue({ data: mockData });

        await pokemonController.getPokemons(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            pokemons: [],
            page: 1,
            limit: 9,
            total: 0,
            totalPages: 0,
        });
    });

    it("should call next with error if axios request fails", async () => {
        const error = new Error("Network Error");
        axios.mockRejectedValue(error);

        await pokemonController.getPokemons(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    jest.mock("axios");

    describe("pokemonController.getPokemons", () => {
        let req, res, next;

        beforeEach(() => {
            req = mockRequest();
            res = mockResponse();
            next = mockNext();
        });

        it("should return paginated pokemons", async () => {
            req.query = { page: 1, limit: 9 };

            const mockData = {
                count: 1118,
                results: [
                    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
                    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
                    // ... more mock pokemons
                ],
            };

            axios.mockResolvedValue({ data: mockData });

            await pokemonController.getPokemons(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                pokemons: [
                    { id: 1, name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
                    { id: 2, name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
                    // ... more formatted pokemons
                ],
                page: 1,
                limit: 9,
                total: 1118,
                totalPages: Math.ceil(1118 / 9),
            });
        });

        it("should return empty array if no pokemons found", async () => {
            req.query = { page: 1, limit: 9 };

            const mockData = {
                count: 0,
                results: [],
            };

            axios.mockResolvedValue({ data: mockData });

            await pokemonController.getPokemons(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                pokemons: [],
                page: 1,
                limit: 9,
                total: 0,
                totalPages: 0,
            });
        });

        it("should call next with error if axios request fails", async () => {
            const error = new Error("Network Error");
            axios.mockRejectedValue(error);

            await pokemonController.getPokemons(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it("should handle invalid page and limit query parameters", async () => {
            req.query = { page: "invalid", limit: "invalid" };

            const mockData = {
                count: 1118,
                results: [
                    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
                    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
                    // ... more mock pokemons
                ],
            };

            axios.mockResolvedValue({ data: mockData });

            await pokemonController.getPokemons(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                pokemons: [
                    { id: 1, name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
                    { id: 2, name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
                    // ... more formatted pokemons
                ],
                page: 1,
                limit: 9,
                total: 1118,
                totalPages: Math.ceil(1118 / 9),
            });
        });
    });
});