const Controller = require("../controllers/HomePageController");
const routerProducts = require("express").Router();

routerProducts.get("/", Controller.showAllGuitars)
routerProducts.get("/recommendation", Controller.recommendation)

module.exports = routerProducts