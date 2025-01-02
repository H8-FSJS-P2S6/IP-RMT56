const request = require("supertest");
const app = require("../app");
const gemini = require("../helpers/geminiAI");

jest.mock("../helpers/geminiAI.js");

describe("POST /gemini-ask", () => {
  test("Success 201: Should return AI generated response", async () => {
    const mockResponse = "Welcome to the world of Pokemon.";
    gemini.mockResolvedValue(mockResponse);
    const prompt = "Welcome to the world of Pokemon";

    const res = await request(app).post("/gemini-ask").send({
      promptUser: prompt,
    });

    expect(res.status).toBe(201);
    expect(res.body).toBe(mockResponse);
  });

  test("Failed 500: Should handle errors from gemini", async () => {
    const errorMessage = "Internal Server Error";
    gemini.mockRejectedValue(new Error(errorMessage));

    const prompt = "Welcome to the world of Pokemon";

    const res = await request(app).post("/gemini-ask").send({
      promptUser: prompt,
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", errorMessage);
  });
});
