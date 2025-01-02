const { OAuth2Client } = require("google-auth-library");
const { comparePass } = require("../helper/bcrypt");
const { signToken } = require("../helper/jwt");
const { User } = require("../models");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "EmailRequired" };
      }
      if (!password) {
        throw { name: "PasswordRequired" };
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw { name: "EmailUsed" };
      }

      const newUser = await User.create({
        email,
        password,
      });

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "EmailRequired" };
      }

      if (!password) {
        throw { name: "PasswordRequired" };
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw { name: "Unauthenticated" };
      }

      const compared = comparePass(password, user.password);

      if (!compared) {
        throw { name: "Unauthenticated" };
      }

      const access_token = signToken({ id: user.id });

      res.status(200).json({ access_token, userId: user.id });
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { idToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const email = payload.email;

      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await User.create(
          {
            email,
            password: "googlelogin",
          },
          { hooks: false }
        );
      } else {
        if (user.password !== "googlelogin") {
          throw { name: "GoogleFailed" };
        }
      }

      const access_token = signToken({ id: user.id });

      res.status(200).json({ access_token, userId: user.id });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
