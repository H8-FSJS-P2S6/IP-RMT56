const axios = require('axios');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;  

async function gemini(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("API key is missing.");
  }
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', 
      {
        prompt: prompt
      },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;  
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    if (error.response && error.response.data && error.response.data.message.includes("API key not valid")) {
      throw new Error("Invalid API Key. Please check your API configuration.");
    }

    throw new Error("Unknown error occurred while calling Gemini API.");
  }
}

module.exports = gemini;
