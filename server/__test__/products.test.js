const app = require("../app");
const {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const { hashPassword } = require("../helpers/hashPassword");
const { signToken } = require("../helpers/jwt");
const { sequelize, User } = require("../models"); 
jest.mock("axios");

let accessToken;

beforeAll(async () => {

    const users = require("../data/user.json").map((e) => {
      delete e.id; 
      return {
        ...e,
        password: hashPassword(e.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  
    await sequelize.queryInterface.bulkInsert("Users", users);
  
    const user = await User.findOne({ where: { email: "jon@mail.com" } }); 
  
    accessToken = signToken({ id: user.id });
  
    const products = require("../data/product.json").map((e) => {
      delete e.id;
      return {
        ...e,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  
    await sequelize.queryInterface.bulkInsert("Products", products);
  });
  

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Products", null, {});
});

describe("GET /products", () => {
  test("Show all guitars successfully with valid query parameters", async () => {
    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .query({ q: "strat", brand: "Fender", type: "electric" }); 

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("brand");
    expect(response.body[0]).toHaveProperty("type");
  });

  test("Show all guitars successfully without query parameters", async () => {
    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0); 
  });
});

describe("GET /products/recommendation", () => {
  test("Get product recommendations successfully", async () => {
    const response = await request(app)
      .get("/products/recommendation")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  test("Fail to get product recommendations with invalid access token", async () => {
    const response = await request(app)
      .get("/products/recommendation")
      .set("Authorization", `Bearer invalidToken`);

    expect(response.status).toBe(401); 
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Fail to get product recommendations when no matching products are found", async () => {
    const mockUser = {
      brand: "fender",
      type: "acoustic",
      price_range: { min_price: 1000, max_price: 5000 },
    };

    const response = await request(app)
      .get("/products/recommendation")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(mockUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Product not found");
  });
});