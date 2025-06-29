const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDB() {
    const MONGO_URI = process.env.MONGODB_URI;
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "zomato-restaurant-data", // 👈 ensure this matches your actual DB name
    });
    console.log("✅ Connected to MongoDB");
}

module.exports = connectToDB;
