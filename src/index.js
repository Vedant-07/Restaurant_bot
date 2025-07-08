const express = require("express");
const path    = require("path");
const connectDB = require("./db/connect");    // your existing connection
const chatRouter = require("./routes/chat");
require("dotenv").config();
const cors = require('cors');
const restaurantDetail = require("./routes/restaurantDetail");
const ordersRouter= require('./routes/orders'); 
const reservationsRouter= require('./routes/reservation'); 

const app = express();
const PORT = process.env.PORT || 8000;


app.use(express.json());

app.use(cors({
  origin: ['https://restaurant-bot-frontend.vercel.app', 'http://localhost:3000']
}));



// API
app.use("/api/chat", chatRouter);


app.use("/api/restaurant", restaurantDetail);

app.use('/api/orders', ordersRouter);

app.use('/api/reservations', reservationsRouter)

// Start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server listening on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ DB failed to connect:", err);
  });
