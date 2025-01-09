var jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

function signToken(data) {
  return jwt.sign(data, secretKey);
}

function verifyToken(token) {
  return jwt.verify(token, secretKey);
}

module.exports = { signToken, verifyToken };