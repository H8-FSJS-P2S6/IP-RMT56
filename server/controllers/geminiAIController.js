const gemini = require("../helpers/geminiAI");

class GeminiAIController {
  static async askAI(req, res, next) {
    try {
      const { promptUser } = req.body;
      let data = await gemini(promptUser);

      res.status(201).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = GeminiAIController;
