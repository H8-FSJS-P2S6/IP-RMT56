const { User } = require("../models");
const { comparePassword } = require("../helpers/hashPassword");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const axios = require('axios');

class UsersController {
  static async googleLogin(req, res, next) {
    try {
      const token = req.body.googleToken
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      // console.log(payload, "<<payload");

      let user = await User.findOne({ where: { email: payload.email } })
      if (!user) {
        user = await User.create({name: payload.name, email: payload.email, password: Math.random().toString() })
      }
      
      const access_token = signToken({id: user.id})

      res.status(200).json({ message: "Login success", access_token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async githubLogin(req, res, next) {
    try {
      const { code } = req.body;

      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        null,
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
          },
          headers: { accept: 'application/json' },
        }
      );
  
      const { access_token: githubAccessToken } = tokenResponse.data;
  
      if (!githubAccessToken) {
        return res.status(400).json({ message: "GitHub login failed" });
      }
  
      // Get user information
      const userInfoResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      });
  
      const { name } = userInfoResponse.data;
  
      // Get user's primary email
      const userEmailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      });
  
      const primaryEmail = userEmailsResponse.data.find(email => email.primary && email.verified)?.email;
  
      if (!primaryEmail) {
        return res.status(400).json({ message: "Unable to retrieve verified email" });
      }
  
      let user = await User.findOne({ where: { email: primaryEmail } });
      if (!user) {
        user = await User.create({
          name,
          email: primaryEmail,
          password: Math.random().toString(),
        });
      }
  
      const access_token = signToken({ id: user.id });
  
      res.status(200).json({ message: "Login success", access_token });
    } catch (error) {
      console.error("GitHub Login Error:", error);
      next(error);
    }
  }


  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name) {
        next({ name: "BadRequest", message: "name is required" });
        return;
      }
      if (!email) {
        next({ name: "BadRequest", message: "Email is required" });
        return;
      }
      if (!password) {
        next({ name: "BadRequest", message: "Password is required" });
        return;
      }

      const user = await User.create(req.body);
      res.status(201).json({message: "Register successful",
        id: user.id,
        username: user.name,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        next({ name: "BadRequest", message: "Email is required" });
        return;
      }
      if (!password) {
        next({ name: "BadRequest", message: "Password is required" });
        return;
      }

      let user;
      if (email) {
        user = await User.findOne({ where: { email } });
      }

      if (!user) {
        next({ name: "Unauthorized", message: "Invalid email or password" });
        return;
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        next({ name: "Unauthorized", message: "Invalid email or password" });
        return;
      }

      const access_token = signToken({ id: user.id, name: user.name });
      res.status(200).json({ message: "Login success", access_token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UsersController;
