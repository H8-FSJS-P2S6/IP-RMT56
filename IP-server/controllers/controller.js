const { comparePassword } = require("../helpers/bycriptjs");
const { signToken } = require("../helpers/jwt");
const { Product, Category, User, Order, Cart, FAQ } = require("../models");

module.exports = class Controller {
  static async getProducts(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        sortOrder = "desc",
        category = "",
      } = req.query;
      const pageNumber = parseInt(page, 10);
      const pageLimit = parseInt(limit, 10);
      const offset = (pageNumber - 1) * limit;
      const order =
        sortOrder === "asc" ? [["createdAt", "ASC"]] : [["createdAt", "DESC"]];
      const categoryFilter = category ? { "$Category.name$": category } : {}; // This is important because Sequelize allows you to reference nested model fields using the $Model.field$ syntax
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
        where: categoryFilter,
        order,
        limit: pageLimit,
        offset,
      });

      const totalProducts = await Product.count({
        include: [
          {
            model: Category,
            where: categoryFilter, // Make sure we filter by Category name as well
          },
        ],
      });
      res.status(200).json({
        data: products,
        currentPage: pageNumber,
        size: pageLimit,
        page: pageNumber,
        totalPages: Math.ceil(totalProducts / pageLimit),
        totalProducts,
      });
    } catch (error) {
      next(error);
      // console.log("🚀 ~ Controller ~ getProducts ~ error:", error)
      // res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  static async getProductsById(req, res, next) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
      });
      if (!product) {
        // res.status(404).json({ message: 'Product Not Found' })
        next({ name: "Not Found", message: "Product Not Found" });
        return;
      }

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async getFAQsPublic(req, res, next) {
    try {
      const faqs = await FAQ.findAll();
      res.status(200).json(faqs);
    } catch (error) {
      next(error);
    }
  }

  static async getFAQsLogIn(req, res, next) {
    try {
      const faqs = await FAQ.findAll();
      res.status(200).json(faqs);
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        next({
          name: "CustomValidation",
          message: "Email is required",
        });
        return;
      }
      if (!password) {
        next({ name: "CustomValidation", message: "Password is required" });
        return;
      }
      let user;
      if (email) {
        user = await User.findOne({ where: { email } });
      }
      if (!user) {
        next({
          name: "Unauthorized",
          message: "Invalid email or password",
        });
        return;
      }
      const userPass = await comparePassword(password, user.password);
      if (!userPass) {
        next({
          name: "Unauthorized",
          message: "Invalid email or password",
        });
        return;
      }
      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      const { password, ...userWithoutPassword } = user.toJSON();
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  }

  // ORDERS
  static async getOrders(req, res, next) {
    try {
      const orders = await Order.findAll({
        where: { UserId: req.user.id },
        include: [Product],
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {
    try {
      const { ProductId, quantity } = req.body;
      const order = await Order.create({
        UserId: req.user.id,
        ProductId,
        quantity,
      });
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  // CART MANAGEMENT
  static async getCart(req, res, next) {
    try {
      const cart = await Cart.findAll({
        where: { UserId: req.user.id },
        include: [Product],
      });
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req, res, next) {
    try {
      const { ProductId, quantity } = req.body;
      const cartItem = await Cart.create({
        UserId: req.user.id,
        ProductId,
        quantity,
      });
      res.status(201).json(cartItem);
    } catch (error) {
      next(error);
    }
  }

  static async updateCart(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const cartItem = await Cart.findOne({
        where: { id, UserId: req.user.id },
      });
      if (!cartItem)
        throw { name: "Not Found", message: "Cart item not found" };

      cartItem.quantity = quantity;
      await cartItem.save();
      res.status(200).json(cartItem);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCartItem(req, res, next) {
    try {
      const { id } = req.params;
      const cartItem = await Cart.findOne({
        where: { id, UserId: req.user.id },
      });
      if (!cartItem)
        throw { name: "Not Found", message: "Cart item not found" };

      await cartItem.destroy();
      res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
};
