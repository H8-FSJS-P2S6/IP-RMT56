const app = require("../app");
const {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/hashPassword");
const axios = require('axios');
jest.mock('axios');

jest.mock('google-auth-library', () => {
  const actual = jest.requireActual('google-auth-library');
  return {
    ...actual,
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: () => ({
          email: "john.doe@mail.com",
          name: "John Doe"
        })
      })
    }))
  };
});

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
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});



describe("POST /githubLogin", () => {
  test("Berhasil login menggunakan GitHub token", async () => {
    axios.post.mockResolvedValueOnce({
      data: { access_token: "mocked-github-access-token" },
    });

    axios.get
      .mockResolvedValueOnce({
        data: { name: "John Doe" },
      })
      .mockResolvedValueOnce({
        data: [{ primary: true, verified: true, email: "john.doe@mail.com" }],
      });

    const response = await request(app) 
      .post("/githubLogin")
      .send({ code: "mocked-github-code" });


    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty("message", "Login success"); 
    expect(response.body).toHaveProperty("access_token"); 
  });

  test("Gagal login jika GitHub tidak memberikan akses token", async () => {
    axios.post.mockResolvedValueOnce({
      data: {},
    });

    const response = await request(app).post("/githubLogin").send({
      code: "mocked-github-code",
    });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "GitHub login failed");
  });

  test("Gagal login jika tidak ada email utama yang terverifikasi", async () => {
    axios.post.mockResolvedValueOnce({
      data: { access_token: "mocked-github-access-token" },
    });
  
    axios.get
      .mockResolvedValueOnce({
        data: { name: "John Doe" }, 
      })
      .mockResolvedValueOnce({
        data: [
          { primary: false, verified: true, email: "unverified@mail.com" },
          { primary: true, verified: false, email: "not.verified@mail.com" },
        ],
      });
  
    const response = await request(app).post("/githubLogin").send({
      code: "mocked-github-code",
    });
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Unable to retrieve verified email");
  });
  
  
});


describe("POST /login, POST /register & POST /googleLogin", () => {
  describe("POST /login", () => {
    test("Berhasil login dan mengirimkan access_token", async () => {
      const response = await request(app).post("/login").send({
        email: "jen@mail.com",
        password: "12345",
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token");
    });

    test("Email tidak diberikan / tidak diinput", async () => {
      const response = await request(app).post("/login").send({
        password: "12345",
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("Password tidak diberikan / tidak diinput", async () => {
      const response = await request(app).post("/login").send({
        email: "jen@mail.com",
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("Email diberikan invalid / tidak terdaftar", async () => {
      const response = await request(app).post("/login").send({
        email: "jane.smith@",
        password: "12345",
      });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("Password diberikan salah / tidak match", async () => {
      const response = await request(app).post("/login").send({
        email: "jen@mail.com",
        password: "secures",
      });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("POST /register", () => {
    test("Berhasil register dan mengirimkan data pengguna", async () => {
      const response = await request(app).post("/register").send({
        name: "John Doe",
        email: "john.doe@mail.com",
        password: "password123",
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Register successful");
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("username", "John Doe");
    });

    test("Nama tidak diberikan / tidak diinput", async () => {
      const response = await request(app).post("/register").send({
        email: "john.doe@mail.com",
        password: "password123",
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "name is required");
    });

    test("Email tidak diberikan / tidak diinput", async () => {
      const response = await request(app).post("/register").send({
        name: "John Doe",
        password: "password123",
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Email is required");
    });

    test("Password tidak diberikan / tidak diinput", async () => {
      const response = await request(app).post("/register").send({
        name: "John Doe",
        email: "john.doe@mail.com",
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Password is required");
    });
  });

  describe("POST /googleLogin", () => {
    test("Berhasil login menggunakan google token", async () => {
      const response = await request(app)
        .post("/googleLogin")
        .send({ googleToken: "google-token" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login success");
      expect(response.body).toHaveProperty("access_token");
    });


  });
});