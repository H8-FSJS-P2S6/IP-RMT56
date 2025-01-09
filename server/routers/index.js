const router = require("express").Router()

const HomeController = require("../controllers/HomePageController")
const Controller = require("../controllers/UsersController")
const authentication = require("../middlewares/authentication")
const routerUsers = require("./users")
const routerProducts = require("./products")
const routerCart = require("./cart")
const routerProfile = require("./profile")

router.get("/", HomeController.homepage)
router.use(routerUsers)
router.use(authentication)
router.use("/profile", routerProfile)
router.use("/products", routerProducts)
router.use("/cart", routerCart)

module.exports = router