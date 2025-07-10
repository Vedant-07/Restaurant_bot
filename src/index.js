const express = require("express");
const connectDB = require("./db/connect");
const chatRouter = require("./routes/chat");
require("dotenv").config();
const cors = require("cors");
const restaurantDetail = require("./routes/restaurantDetail");
const orders = require("./routes/orders");
const reservations = require("./routes/reservations");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://restaurant-bot-frontend.vercel.app",
      "http://localhost:3000",
    ],
  })
);

// API
app.use("/api/chat", chatRouter);

app.use("/api/restaurant", restaurantDetail);

app.use("/api/orders", orders.router);

app.use("/api/reservations", reservations.router);

// Start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server listening on Port:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB failed to connect:", err);
  });
