const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

module.exports = async function authenthication(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    next({ name: "Unauthorized", message: "Token is required" });
    return;
  }
  const [, token] = bearerToken.split(" ");
  if (!token) {
    next({ name: "Unauthorized", message: "Invalid token format" });
    return;
  }
  try {
    const data = verifyToken(token);
    const user = await User.findByPk(data.id);
    if (!user) {
      next({ name: "Unauthorized", message: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next({ name: "Unauthorized", message: "Token has expired" });
    }
    next(error);
  }
};
