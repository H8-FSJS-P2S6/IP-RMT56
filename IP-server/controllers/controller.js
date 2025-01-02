const { where } = require("sequelize");
const { comparePassword } = require("../helpers/bycriptjs");
const { signToken, verifyToken } = require("../helpers/jwt");
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
const axios = require("axios");
const { OpenAI } = require("openai"); // Import OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your OpenAI API key in environment variables
});
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
      console.log("🚀 ~ Controller ~ getCart ~ error:", error);
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
      const { id } = req.params;
      const UserId = req.user.id; // User ID from middleware

      const cartItem = await Cart.findOne({
        where: { id, UserId },
      });
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      await cartItem.destroy(); // Remove the cart item
      res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async clearCart(req, res, next) {
    const userId = req.user.id; // Assuming you have a middleware to authenticate and get the user ID
    console.log("🚀 ~ Controller ~ clearCart ~ userId:", userId);

    try {
      // Delete all items in the cart for the authenticated user
      await Cart.destroy({
        where: {
          UserId: userId, // Only clear the cart for the current user
        },
      });

      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
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
      //   console.log("🚀 ~ Controller ~ getOrderCarts ~ orderCarts:", orderCarts);
      res.status(200).json(orderCarts);
    } catch (error) {
      next(error);
    }
  }

  // Open AI Chatbot
  static async chatbotAI(req, res, next) {
    try {
      const { message } = req.body;
      const faqList = require("../data/faq.json");
      // If the message is "FAQ," send buttons with FAQ questions
      if (message.toLowerCase() === "faq") {
        const faqButtons = faqList.map((faq, index) => ({
          id: index + 1, // Unique ID for the button
          question: faq.question,
        }));

        return res.json({
          type: "buttons",
          buttons: faqButtons,
          //   response: "Here are some FAQs. Click a question to see the answer.",
        });
      }

      // Handle when a button is clicked (message contains a button ID)
      const buttonIdMatch = message.match(/^faq-button-(\d+)$/);
      if (buttonIdMatch) {
        const buttonId = parseInt(buttonIdMatch[1], 10) - 1; // Convert to 0-based index
        if (faqList[buttonId]) {
          return res.json({
            response: `Answer: ${faqList[buttonId].answer}`,
          });
        } else {
          return res.json({ response: "Invalid FAQ selection." });
        }
      }
      if (!message || message.toLowerCase() === "hi") {
        const greetingMessage = `Hello! How can I help you? You can send "FAQ" to see the list of FAQs. You can also query the sum of your order by sending "order sum #ID", where ID is your order number.`;
        return res.json({ response: greetingMessage });
      }
      console.log("🚀 ~ Controller ~ chatbotAI ~ message:", message);
      const token = req.headers.authorization?.split(" ")[1]; // Extract the token from 'Bearer <token>'

      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      // Verify the token (replace with your secret or use a library like dotenv for environment variables)
      const decoded = verifyToken(token);
      if (decoded) {
        if (message.toLowerCase().includes("order sum")) {
          const orderIdMatch = message.match(/#?(\d+)/); // Make the '#' optional

          if (orderIdMatch) {
            const orderId = orderIdMatch[1]; // Get the actual order ID from the regex match

            // Fetch order details from your server/database
            const orderDetailsResponse = await axios.get(
              `http://localhost:3000/orders/${orderId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const orderDetails = orderDetailsResponse.data;
            console.log(
              "🚀 ~ Controller ~ chatbotAI ~ orderDetails:",
              orderDetails
            );

            // Calculate the total price
            const totalPrice = orderDetails.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            );

            // Formulate a response
            const responseMessage =
              `Order #${orderId} details: ${orderDetails.length} items purchased with total price ${totalPrice} IDR. ` +
              orderDetails
                .map((item) => {
                  return `${item.Product.name} (${item.quantity} x ${item.price} IDR)`;
                })
                .join(" and ");

            // Return the response back to the user
            return res.json({ response: responseMessage });
          }
        } else if (!message.toLowerCase().includes("order sum")) {
          console.log("masuk siniiiii");
          function getMatchScore(str1, str2) {
            const words1 = str1.toLowerCase().split(" ");
            const words2 = str2.toLowerCase().split(" ");
            let matchCount = 0;

            words1.forEach((word1) => {
              words2.forEach((word2) => {
                if (word1.includes(word2) || word2.includes(word1)) {
                  matchCount += 1;
                }
              });
            });

            // Use max length instead of total length for normalization
            return matchCount / Math.max(words1.length, words2.length);
          }

          // Find the FAQ with the highest match score
          const matchedFaq = faqList.reduce(
            (bestMatch, currentFaq) => {
              const score = getMatchScore(message, currentFaq.question);
              console.log(`FAQ: "${currentFaq.question}" | Score: ${score}`); // Log score for debugging
              if (score > bestMatch.score) {
                return { faq: currentFaq, score };
              }
              return bestMatch;
            },
            { faq: null, score: 0 }
          );

          // If match score is above a threshold, respond with the matched FAQ answer
          if (matchedFaq.score > 0.3) {
            // Adjusted threshold
            console.log(
              `Matched FAQ: ${matchedFaq.faq.question} (Score: ${matchedFaq.score})`
            );
            return res.json({ response: matchedFaq.faq.answer });
          }
        }
      }
      return res.json({
        response: "I'm sorry, I couldn't find an answer to your question. ",
      });
    } catch (error) {
      console.log("🚀 ~ Controller ~ chatbotAI ~ error:", error);
      res.status(500).json({ error: "Failed to communicate with AI" });
    }
  }
};
