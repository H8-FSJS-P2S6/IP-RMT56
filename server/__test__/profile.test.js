const request = require("supertest");
const app = require("../app"); 
const { sequelize, User } = require("../models"); 
const { hashPassword } = require("../helpers/hashPassword");
const { signToken } = require("../helpers/jwt");

let accessToken;
let userId;

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
  userId = user.id;
  accessToken = signToken({ id: user.id }); 
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {});
});

describe("Profile", () => {
  test("Show user profile successfully", async () => {
    const response = await request(app)
      .get("/profile") 
      .set("Authorization", `Bearer ${accessToken}`); 

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object) 
  });

  test("Update user preferences successfully", async () => {
    const updatedPreferences = {
      brand: "Fender",
      type: "bass",
      price_range: { min_price: 500000, max_price: 5000000 },
    };

    const response = await request(app)
      .put(`/profile/preference`) 
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedPreferences);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      message: "Preferences updated successfully",
      brand: updatedPreferences.brand,
      type: updatedPreferences.type,
      price_range: updatedPreferences.price_range,
    }));
  });

  test("Fail to update preference without brand", async () => {
    const updatedPreferences = {
      brand: "",
      type: "electric",
      price_range: { min_price: 100000, max_price: 1000000 },
    };

    const response = await request(app)
      .put(`/profile/preference`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedPreferences);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Brand is Required");
  });
  
  test("Fail to update preference without brand", async () => {
    const updatedPreferences = {
      brand: "PRS Guitars",
      type: "",
      price_range: { min_price: 100000, max_price: 1000000 },
    };

    const response = await request(app)
      .put(`/profile/preference`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedPreferences);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Type is Required");
  });
    
  test("Fail to update preference with invalid price range", async () => {
    const updatedPreferences = {
      brand: "Gibson",
      type: "electric",
      price_range: { min_price: 15000000, max_price: 10000000 }, 
    };

    const response = await request(app)
      .put(`/profile/preference`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedPreferences);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Min price must be less than Max price");
  });
    
  test("Fail to update preference with missing min or max price", async () => {
    const updatedPreferences = {
      brand: "Gibson",
      type: "electric",
      price_range: { min_price: 15000000 }, 
    };
  
    const response = await request(app)
      .put(`/profile/preference`) 
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedPreferences);
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Both min price and max price must be provided");
  });
    
  test("Fail to update preference with invalid price range", async () => {
    const updatedPreferences = {
      brand: "Gibson",
      type: "electric",
      price_range: { min_price: 15000000, max_price: 10000000 }, 
    };

    const response = await request(app)
      .put(`/profile/preference`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedPreferences);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Min price must be less than Max price");
  });
});