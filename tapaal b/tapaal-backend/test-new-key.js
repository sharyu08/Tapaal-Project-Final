require("dotenv").config();   // 🔥 ADD THIS LINE

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Test new Gemini API key
async function testGeminiAPI() {
    try {
        console.log("Testing new Gemini API key...");
        console.log("Loaded Key:", process.env.GEMINI_API_KEY); // Optional debug
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent("Hello, respond with 'API working' if you receive this");
        const response = await result.response;
        const reply = response.text();
        
        console.log("✅ Gemini API Response:", reply);
        console.log("✅ API connection successful!");
    } catch (error) {
        console.error("❌ Gemini API Error:", error.message);
    }
}

testGeminiAPI();
