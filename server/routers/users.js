const Controller = require("../controllers/UsersController")

const routerUsers = require("express").Router()

routerUsers.post("/register", Controller.register)
routerUsers.post("/login", Controller.login)
routerUsers.post("/googleLogin", Controller.googleLogin)
routerUsers.post('/githubLogin', Controller.githubLogin)
module.exports = routerUsers