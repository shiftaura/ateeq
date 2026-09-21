const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
    });

    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Database connection error: ${error.message}`);
    // Clean process exit on DB connection failure as required
    process.exit(1);
  }
};

module.exports = connectDB;
