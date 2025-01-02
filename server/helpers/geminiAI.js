const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Fungsi untuk mendapatkan greeting berdasarkan waktu
const getGreeting = () => {
  const currentHour = new Date().getHours();
  
  if (currentHour >= 5 && currentHour < 12) {
    return "Selamat pagi";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Selamat siang";
  } else if (currentHour >= 18 && currentHour < 21) {
    return "Selamat sore";
  } else {
    return "Selamat malam";
  }
};

const gemini = async (promptUser) => {
  const googleAPIKey = process.env.GOOGLE_API_KEY;

  const genAI = new GoogleGenerativeAI(googleAPIKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Menambahkan greeting sesuai waktu
  const greeting = getGreeting();

  const basePrompt = `${greeting}, `;
  const prompt = promptUser ? `${basePrompt}${promptUser}` : `${basePrompt} Welcome to the world of Pokemon`;

  try {
    const result = await model.generateContent(prompt);

    const answer = await result.response.text();
    return answer;
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Error generating response.");
  }
};

module.exports = gemini;

