const { Product} = require("../models");
const {getRecommendation} = require("../helpers/gemini");
const { Op } = require("sequelize");

class HomePageController {
  static async homepage(req, res, next) {
    try {
      res.json({ message: "Welcome to yourGuitar server" });
    } catch (error) {
      next(error);
    }
  }

  static async showAllGuitars(req, res, next) {
    try {
      const { q, brand, type } = req.query;

      const where = {};
      if (q) where.name = { [Op.iLike]: `%${q}%` }; 
      if (brand) where.brand = { [Op.iLike]: `%${brand}%` }; 
      if (type) where.type = { [Op.iLike]: `%${type}%` }; 

      const guitars = await Product.findAll({ where });
      return res.status(200).json(guitars);
    } catch (error) {
      next(error);
    }
  }

  static async recommendation(req, res, next) {
    try {
      const { brand, type, price_range} = req.user;
    
  
      const products = await Product.findAll({
        attributes: ['id', 'imgUrl', 'name', 'brand', 'type', 'price', 'description'],
      });
      // console.log("isi product:", products);
  
      if (!products) {
        next({ name: "NotFound", message: "No matching products found" });
        return;
      }
  
      const response = await getRecommendation({ brand, type, price_range }, products);
  
      res.status(200).json(response);
    } catch (error) {
      // console.log("ada apa", error);
      next(error);
    }
  }
}
module.exports = HomePageController;
