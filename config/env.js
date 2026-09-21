const dotenv = require("dotenv");
const path = require("path");

// Load .env file from backend root
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mediconsult",
  JWT_SECRET: process.env.JWT_SECRET || "mediconsult_super_secret_jwt_key_2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
};

module.exports = env;
