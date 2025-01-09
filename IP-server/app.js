require("dotenv").config();
const express = require("express");
const { OpenAI } = require("openai");

const cors = require("cors"); // Import cors

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key
});
const app = express();

app.use(cors());
const midtransClient = require("midtrans-client");
const router = require("./routers");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

module.exports = app;
