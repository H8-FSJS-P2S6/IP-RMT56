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
const { signToken } = require("../helpers/jwt");

let access_token;
let userId;
let productId;
let cartItemId;

beforeAll(async () => {
  const user = {
    name: "Test User",
    email: "test@mail.com",
    password: hashPassword("password123"),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createdUser = await sequelize.models.User.create(user);
  userId = createdUser.id;

  access_token = signToken({ id: userId });

  const product = {
    name: "Test Product",
    brand: "Test Brand",
    type: "Test Type",
    price: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createdProduct = await sequelize.models.Product.create(product);
  productId = createdProduct.id;

  await sequelize.models.Cart.destroy({ where: { userId } });

  const cartItem = await sequelize.models.Cart.create({
    userId,
    productId,
    quantity: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  cartItemId = cartItem.id;
});

afterAll(async () => {
  await sequelize.models.Cart.destroy({ where: {} });
  await sequelize.models.User.destroy({ where: {} });
  await sequelize.models.Product.destroy({ where: {} });
});

describe("GET /cart", () => {
  test("Retrieve all items in cart", async () => {
    const response = await request(app)
      .get("/cart")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.body).toHaveLength(1); 
    expect(response.status).toBe(200);
  });

  test("Fail to retrieve cart if no access token", async () => {
    const response = await request(app).get("/cart");

    expect(response.status).toBe(401); 
    expect(response.body.message).toBe("Invalid token");
  });
});

describe("POST /cart", () => {
  test("Add product to cart", async () => {
    const response = await request(app)
      .post("/cart")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ productId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      `Product with Id ${productId} added to cart`
    );
  });

  test("Fail to add product to cart if no access token", async () => {
    const response = await request(app).post("/cart").send({ productId });

    expect(response.status).toBe(401); 
    expect(response.body.message).toBe("Invalid token");
  });
});

describe("PUT /cart/:id", () => {
  test("Update product quantity in cart", async () => {
    const response = await request(app)
      .put(`/cart/${cartItemId}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ quantity: 2 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Cart item updated successfully.");
    expect(response.body.cartItem.quantity).toBe(2);
  });

  test("Fail to update cart item if quantity is less than 1", async () => {
    const response = await request(app)
      .put(`/cart/${cartItemId}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ quantity: 0 });

    expect(response.status).toBe(400); 
    expect(response.body.message).toBe("Quantity must be at least 1.");
  });

  test("Fail to update cart item if not found", async () => {
    const response = await request(app)
      .put("/cart/0") 
      .set("Authorization", `Bearer ${access_token}`)
      .send({ quantity: 2 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });

  test("Fail to update cart if no access token", async () => {
    const response = await request(app).put("/cart/1").send({ quantity: 2 });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });
});

describe("DELETE /cart/:id", () => {
  test("Remove item from cart", async () => {
    const response = await request(app)
      .delete(`/cart/${cartItemId}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      `Product Id: ${cartItemId} removed from cart`
    );
  });

  test("Fail to delete cart item if not found", async () => {
    const response = await request(app)
      .delete("/cart/9999") 
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(404); 
    expect(response.body.message).toBe("Product not found");
  });

  test("Fail to delete cart item if no access token", async () => {
    const response = await request(app).delete("/cart/1");

    expect(response.status).toBe(401); 
    expect(response.body.message).toBe("Invalid token");
  });
});