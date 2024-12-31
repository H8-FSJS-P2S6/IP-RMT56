const { comparePassword } = require("../helpers/bycriptjs");
const { signToken } = require("../helpers/jwt");
const { Product, Category, User } = require("../models");
const user = require("../models/user");

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
      // console.log("🚀 ~ Controller ~ getProducts ~ categoryFilter:", categoryFilter)
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
        where: categoryFilter,
        order,
        limit: pageLimit,
        offset,
      });
      // if (products.length === 0) {
      //     // res.status(404).json({ message: 'Product Not Found' })
      //     next({ name: 'Not Found', message: 'Product Not Found' })
      //     return
      // }
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
  static async getProductsPublic(req, res, next) {
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
        include: {
          model: Category,
          attributes: ["name"],
        },
        where: categoryFilter,
        order,
        limit: pageLimit,
        offset,
      });
      // if (products.length === 0) {
      //     // res.status(404).json({ message: 'Product Not Found' })
      //     return next({ name: 'Not Found', message: 'Product Not Found' })
      // }
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
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
      });
      if (!product) {
        // res.status(404).json({ message: 'Product Not Found' })
        next({ name: "Not Found", message: "Product Not Found" });
        return;
      }
      const response = {
        currentPage: 1, // Single product, so it's on the first page
        size: 1, // Only 1 product in the response
        totalPages: 1,
        totalProducts: 1,
        product,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getProductsByIdPublic(req, res, next) {
    try {
      const product = await Product.findOne({
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
        where: {
          id: req.params.id,
        },
      });
      if (!product) {
        res.status(404).json({ message: "Product Not Found" });
        return;
      }
      const response = {
        currentPage: 1, // Single product, so it's on the first page
        size: 1, // Only 1 product in the response
        totalPages: 1,
        totalProducts: 1,
        product,
      };
      res.status(200).json(response);
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
};
