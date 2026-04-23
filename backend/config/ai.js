require("dotenv").config();
const OpenAI = require("openai");

let aiClient = null;
let aiModel = "gpt-3.5-turbo";
let provider = "none";

const initializeAI = () => {
  try {
    // Check for Groq first (preferred for speed)
    const groqKey = process.env.GROQ_API_KEY || process.env.GROQ_API;
    if (groqKey && groqKey.length > 10) {
      aiClient = new OpenAI({
        apiKey: groqKey,
        baseURL: "https://api.groq.com/openai/v1",
      });
      aiModel = "llama-3.3-70b-versatile"; // High performance Groq model
      provider = "groq";
      console.log("✅ Groq AI initialized (Model: " + aiModel + ")");
      return;
    }

    // Fallback to OpenAI
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 20) {
      aiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      aiModel = "gpt-3.5-turbo";
      provider = "openai";
      console.log("✅ OpenAI initialized (Model: " + aiModel + ")");
      return;
    }

    console.log("⚠️ No AI API keys found. AI features will be limited.");
  } catch (error) {
    console.error("❌ AI initialization failed:", error.message);
  }
};

initializeAI();

module.exports = {
  getAIClient: () => aiClient,
  getAIModel: () => aiModel,
  getProvider: () => provider,
  isAIReady: () => aiClient !== null
};
