const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const gemini = async (promptUser) => {
  const googleAPIKey = process.env.GOOGLE_API_KEY;

  const genAI = new GoogleGenerativeAI(googleAPIKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const basePrompt = "Membahas digimon, rekomendasi digimon,";

  const prompt = promptUser
    ? `${basePrompt} ${promptUser}`
    : `${basePrompt} semua tentang digimon`;

  try {
    const result = await model.generateContent(prompt);

    const answer = await result.response.text();
    return answer;
  } catch (error) {
    console.error("Error generating Digimon recommendations:", error);
    throw new Error("Error generating Digimon recommendations.");
  }
};

module.exports = gemini;
