const express = require("express");
const Controller = require("../controllers/controller");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.get("/", (req, res) =>
  res.json({ message: "Welcome to Ecommerce API!" })
);

// Products
router.get("/products", Controller.getProducts);
router.get("/products/:id", Controller.getProductsById);

// Categories
router.get("/categories", Controller.getCategories);

// login
router.post("/login", Controller.login);

// register
router.post("/register", Controller.register);

// FAQs public
router.get("/pub/faqs", Controller.getFAQsPublic);

// AUTHENTICATION (need log in to make transactions)
router.use(authentication);

// FAQs logged-in
router.get("/faqs", Controller.getFAQsLogIn);

// User-specific orders and cart management
router.get("/orders", Controller.getOrders); // Fetch user orders
router.post("/orders", Controller.createOrder); // Create a new order

router.get("/cart", Controller.getCart); // Get cart items
router.post("/cart", Controller.addToCart); // Add item to cart
router.put("/cart/:id", Controller.updateCart); // Update item in cart
router.delete("/cart/:id", Controller.deleteCartItem); // Delete item from cart

function errorHandler(err, req, res, next) {
  console.log("🚀 ~ errorHandler ~ err:", err);
  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      return res.status(400).json({ message: err.errors[0].message });
    case "CustomValidation":
      return res.status(400).json({ message: err.message });
    case "BadRequest":
      return res.status(400).json({ message: err.message });
    case "Unauthorized":
      return res.status(401).json({ message: err.message ?? "Invalid token" });
    case "JsonWebTokenError":
      return res.status(401).json({ message: "Invalid token" });
    case "Forbidden":
      return res.status(403).json({ message: "You are not Authorized" });
    case "Not Found":
      return res.status(404).json({ message: err.message });
    default:
      res.status(500).json({ message: "Internal Server Error" });
  }
}

router.use(errorHandler);

module.exports = router;
