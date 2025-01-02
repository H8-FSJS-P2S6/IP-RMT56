const { where } = require("sequelize");
const { comparePassword } = require("../helpers/bycriptjs");
const { signToken } = require("../helpers/jwt");
const {
  Product,
  Category,
  User,
  Order,
  Cart,
  OrderCart,
  FAQ,
} = require("../models");
const { Op } = require("sequelize");
const midtransClient = require("midtrans-client");
module.exports = class Controller {
  static async getProducts(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "desc",
        category = "",
        q = "",
      } = req.query;
      const pageNumber = parseInt(page, 10);
      const pageLimit = parseInt(limit, 10);
      const offset = (pageNumber - 1) * limit;
      // Define the sorting logic
      const order = [
        ["createdAt", sort.toUpperCase() === "ASC" ? "ASC" : "DESC"],
      ];
      const productFilter = q
        ? { name: { [Op.iLike]: `%${q}%` } } // Sequelize case-insensitive LIKE query
        : {};
      const categoryFilter = category ? { "$Category.id$": category } : {}; // This is important because Sequelize allows you to reference nested model fields using the $Model.field$ syntax

      // Combine filters
      const whereCondition = {
        ...productFilter,
        ...categoryFilter,
      };
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
        where: whereCondition,
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
        where: productFilter,
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

      res.status(200).json(product);
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
        include: [
          {
            model: OrderCart,
            include: [Product], // This will fetch the related products for each order
          },
        ],
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {
    try {
      console.log("🚀 ~ Controller ~ createOrder ~ req.user.id:", req.user.id);
      console.log("🚀 ~ Controller ~ createOrder ~ req.body:", req.body);
      const {
        order_id,
        transaction_id,
        gross_amount,
        payment_type,
        transaction_status,
        transaction_time,
      } = req.body.transactionDetails;

      const UserId = req.user.id;

      const cartItems = await Cart.findAll({ where: { UserId } });

      const newOrder = await Order.create({
        UserId,
        transactionId: transaction_id,
        orderId: order_id,
        grossAmount: gross_amount,
        paymentType: payment_type,
        transactionStatus: transaction_status,
        transactionTime: transaction_time,
      });

      // Then, create OrderCart entries for each item in the cart
      for (let item of cartItems) {
        // console.log("🚀 ~ Controller ~ createOrder ~ item:", item);
        const product = await Product.findOne({
          where: { id: item.ProductId },
        });
        if (product) {
          // Create an entry in the OrderCart with price from the Product
          await OrderCart.create({
            OrderId: newOrder.id, // Reference the new order
            ProductId: item.ProductId, // Reference the product
            quantity: item.quantity, // Quantity of the product in the cart
            price: product.price, // Price fetched from the Product model
          });
        } else {
          console.log(`Product with ID ${item.ProductId} not found.`);
        }
      }
      res.status(201).json(newOrder);
    } catch (error) {
      console.log("🚀 ~ Controller ~ createOrder ~ error:", error);
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
      const quantity = 1;
      const { id } = req.params;
      // Check if the product is already in the user's cart
      const existingCartItem = await Cart.findOne({
        where: {
          UserId: req.user.id,
          ProductId: id,
        },
      });

      if (existingCartItem) {
        // If product is already in cart, increase quantity by 1
        existingCartItem.quantity += 1;
        await existingCartItem.save(); // Save the updated cart item
        return res.status(200).json(existingCartItem);
      } else {
        // If not, create a new cart item
        const newCartItem = await Cart.create({
          UserId: req.user.id,
          ProductId: id,
          quantity: quantity,
        });
        return res.status(201).json(newCartItem);
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateCart(req, res, next) {
    try {
      const { id } = req.params; // Cart ID
      const { quantity } = req.body; // New quantity
      const UserId = req.user.id; // User ID from middleware

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cartItem = await Cart.findOne({
        where: { ProductId: id, UserId },
        include: { model: Product, attributes: ["stock"] },
      });

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      if (quantity > cartItem.Product.stock) {
        return res.status(400).json({ message: "Stock not sufficient" });
      }

      cartItem.quantity = quantity;
      await cartItem.save(); // Save the updated cart item
      res.status(200).json(cartItem);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCartItem(req, res, next) {
    try {
      const { id } = req.params; // Cart ID
      const UserId = req.user.id; // User ID from middleware

      const cartItem = await Cart.findOne({ where: { id, UserId } });
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      await cartItem.destroy(); // Remove the cart item
      res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async generateMidtransToken(req, res, next) {
    const { totalAmount } = req.body;
    try {
      const findUser = await User.findByPk(req.user.id);
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: Math.floor(123456 + Math.random() * 99),
          gross_amount: totalAmount,
          //   gross_amount: 1000,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: findUser.email,
        },
      };
      const midtransToken = await snap.createTransaction(parameter);
      res.status(201).json(midtransToken);
    } catch (error) {
      next(error);
    }
  }

  // Get all OrderCarts for a specific order
  static async getOrderCarts(req, res, next) {
    try {
      const { orderId } = req.params;
      console.log("🚀 ~ Controller ~ getOrderCarts ~ orderId:", orderId);
      const orderCarts = await OrderCart.findAll({
        where: { OrderId: orderId },
        include: [Product], // Include Product details in the response
      });
      console.log("🚀 ~ Controller ~ getOrderCarts ~ orderCarts:", orderCarts);
      res.status(200).json(orderCarts);
    } catch (error) {
      next(error);
    }
  }
};
