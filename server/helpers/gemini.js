require("dotenv").config({ path: "../.env" });
// helpers/geminiHelper.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function getRecommendation(preferences, products) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Buat prompt untuk AI
    const prompt = `
   Data:
   Filter the products list strictly based on this data:
    1. The "brand" of the product must match "${preferences.brand}"
    2. The "type" of the product must match "${preferences.type}"
    3. The "price" of the product must fall within the range ${preferences.price_range.min_price} - ${preferences.price_range.max_price}.
        
    Products:
     ${products
       .map(
         (p) => `
      {
        "id": ${p.id},
        "imgUrl": "${p.imgUrl}",
        "name": "${p.name}",
        "brand": "${p.brand}",
        "type": "${p.type}",
        "price": ${p.price},
        "description": "${p.description}"
      }`
       )
       .join(",")}

    
    Based on the data, provide a recommendation list using this JSON schema:
    
    Response the return data. If Products not matched with one of point the data give {"message": "Product not found"} 
    
    Product = 
    {
        "id": integer,
        "imgUrl": string,
        "name": string,
        "brand": string,
        "type": string,
        "price": integer,
        "description": string,
      }
      
  
    
    Return: Array<Product>
    `;
      
    // console.log("isi prompt", prompt);

    // Generate content dari Gemini AI
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/\`\`\`json|\`\`\`/gi,'')
    // console.log(responseText, "<<<");
    const recommend = JSON.parse(responseText)
    // console.log(recommend);
    return recommend;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}

module.exports = { getRecommendation };
