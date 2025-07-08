const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDB() {
  try {
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) {
      throw new Error("❌ MONGODB_URI is not defined in environment variables.");
    }

    await mongoose.connect(MONGO_URI, {
      dbName: "zomato-restaurant-data", 
    });

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    throw err; 
  }
}

module.exports = connectToDB;
