const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const queryInterface = sequelize.getQueryInterface();
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

let client;
beforeAll(async () => {
  const hashedPassword = await bcrypt.hash("test123", 10);
  const users = [
    {
      email: "ponyo@mail.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await queryInterface.bulkInsert("Users", users, {});

  client = new OAuth2Client();
});

afterAll(async () => {
  await queryInterface.bulkDelete(
    "Users",
    {},
    { 
      truncate: true,
      restartIdentity: true,
      cascade: true
    }
  );
  await sequelize.close();
});

describe("POST /login", () => {
  test("Success 200: OK", async () => {
    const res = await request(app).post("/login").send({
      email: "ponyo@mail.com",
      password: "test123",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token");
  });
});

describe("POST /login", () => {
  describe("Failed Login", () => {
    test("Failed 400: null email", async () => {
      const res = await request(app).post("/login").send({
        password: "admin123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Email is required");
    });

    test("Failed 400: null password", async () => {
      const res = await request(app).post("/login").send({
        email: "admin@mail.com",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Password is required");
    });

    test("Failed 401: invalid email", async () => {
      const res = await request(app).post("/login").send({
        email: "invalid@mail.com",
        password: "test123",
      });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid Email or Password");
    });

    test("Failed 401: invalid password", async () => {
      const res = await request(app).post("/login").send({
        email: "ponyo@mail.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid Email or Password");
    });
  });
});

describe("POST /register", () => {
  // **Positive Test Case**
  describe("Success register", () => {
    test("Success 201: OK", async () => {
      const res = await request(app).post("/register").send({
        fullName: "Boo",
        email: "boo@mail.com",
        password: "test123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("email", "boo@mail.com");
    });
  });

  // **Negative Test Cases**
  describe("Failed register", () => {
    test("Failed 400: null email", async () => {
      const res = await request(app).post("/register").send({
        password: "testi123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Email is required");
    });

    test("Failed 400: null password", async () => {
      const res = await request(app).post("/register").send({
        email: "user@mail.com",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Password is required");
    });

    test("Failed 400: email already used", async () => {
      await request(app).post("/register").send({
        fullName: "admin",
        email: "admin@mail.com",
        password: "admin123",
      });

      const res = await request(app).post("/register").send({
        fullName: "admin",
        email: "admin@mail.com",
        password: "newuser123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Email already used");
    });
  });
});

// describe("POST /google-login", () => {
//   test("Success 200: OK", async () => {

//     jest.spyOn(client, "verifyIdToken").mockResolvedValue({
//       getPayload: jest.fn(() => ({
//         email: "googleuser@mail.com",
//       })),
//     });

//     const res = await request(app).post("/google-login").send({
//       idToken: "mock-google-id-token",
//     });

//     console.log("Response body:", res.body);

//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty("access_token");
//     expect(res.body).toHaveProperty("userId");

//     jest.restoreAllMocks();
//   });
// });
