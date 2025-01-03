const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const gemini = async (promptUser) => {
  const googleAPIKey = process.env.GOOGLE_API_KEY;

  const genAI = new GoogleGenerativeAI(googleAPIKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const basePrompt = "Welcome to the world of Pokemon";

  const prompt = promptUser
    ? `${basePrompt} ${promptUser}`
    : `${basePrompt} all about pokemon`;

  try {
    const result = await model.generateContent(prompt);

    const answer = await result.response.text();
    return answer;
  } catch (error) {
    console.error("Error generating welcome pokemon:", error);
    throw new Error("Error generating welcome pokemon.");
  }
};

module.exports = gemini;
