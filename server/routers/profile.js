const Controller = require("../controllers/ProfileController");
const routerProfile = require("express").Router();

routerProfile.get("/", Controller.showProfile)
routerProfile.put("/preference", Controller.updatePreference)

module.exports = routerProfile