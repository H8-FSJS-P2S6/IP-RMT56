const { Cart, Product } = require("../models");

class CartController {
  static async addToCart(req, res, next) {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
      await Cart.create({
        userId,
        productId,
        quantity: 1,
      });

      return res.status(200).json({ message: `Product with Id ${productId} added to cart` });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async showCartItem(req, res, next) {
    const userId = req.user.id;

    try {
      const cartItems = await Cart.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            attributes: ["id", "imgUrl", "name", "brand", "type", "price"],
          },
        ],
      });

      if (cartItems.length === 0) {
        return res.status(200).json({ message: "Your cart is empty" });
      }

      return res.status(200).json(cartItems);
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantity(req, res, next) {
    try {
      const { id } = req.params; 
      const { quantity } = req.body;

      if (quantity < 1) {
        next({ name: "BadRequest", message: "Quantity must be at least 1." });
        return;
      }
      

      const cartItem = await Cart.findByPk(id); 

      if (!cartItem) {
        next({ name: "NotFound", message: "Product not found" });
        return;
      }

      cartItem.quantity = +(quantity);
      await cartItem.save();

      return res.status(200).json({
        message: "Cart item updated successfully.",
        cartItem,
      });
    } catch (error) {
        // console.log("ini error:", error);
      next(error);
    }
  }

  static async deleteItem(req, res, next) {
    const { id } = req.params;
    // console.log("ini id cart:", id);

    try {
      const product = await Cart.destroy({
        where: {
          id,
        },
      });

      if (!product) {
        return next({ name: "NotFound", message: "Product not found" });
      }

      return res.status(200).json({ message: `Product Id: ${id} removed from cart` });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = CartController;
