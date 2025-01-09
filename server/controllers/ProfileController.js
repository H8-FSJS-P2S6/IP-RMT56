const { User } = require("../models");

class ProfileController {
  static async showProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        next({ name: "NotFound", message: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updatePreference(req, res, next) {
    try {
      const { brand, type, price_range } = req.body;

      if (price_range) {
        const { min_price, max_price } = price_range;
        if (!min_price || !max_price) {
          return next({
            name: "BadRequest",
            message: "Both min price and max price must be provided",
          });
        }

        if (Number(min_price) >= Number(max_price)) {
          return next({
            name: "BadRequest",
            message: "Min price must be less than Max price",
          });
        }
      }

      const updatedData = {
        brand: brand === "" ? "" : brand,
        type: type === "" ? "" : type,
        price_range: price_range === "" ? null : price_range,
      };

      if (!brand) {
        return next({ name: "BadRequest", message: "Brand is Required" });
      }

      if (!type) {
        return next({ name: "BadRequest", message: "Type is Required" });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return next({ name: "NotFound", message: "User not found" });
      }

      // Hanya update preferensi yang diberikan, kecuali password
      await user.update(updatedData);

      return res.status(200).json({
        message: "Preferences updated successfully",
        id: user.id,
        name: user.name,
        email: user.email,
        brand: user.brand,
        type: user.type,
        price_range: user.price_range,
      });
    } catch (error) {
      console.log("what happen:", error);
      next(error);
    }
  }
}

module.exports = ProfileController;
