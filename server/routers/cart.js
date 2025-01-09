const Controller = require("../controllers/CartController");
const routerCart = require("express").Router();

routerCart.get("/", Controller.showCartItem)
routerCart.post("/", Controller.addToCart)
routerCart.put("/:id", Controller.updateQuantity)
routerCart.delete("/:id", Controller.deleteItem)

module.exports = routerCart