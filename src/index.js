const express = require("express");
const { BotFrameworkAdapter } = require("botbuilder");
const connectToDB = require("./db/connect");
const RestaurantBot = require("./bot/RestaurantBot");
const { handleMessage } = require("./bot/dialogHandler");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3978;

// Setup Bot Adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Setup Bot
const myBot = new RestaurantBot({ handleMessage });

// Listen for incoming messages
app.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await myBot.run(context);
    });
});

// Start Server
app.listen(PORT, async () => {
    await connectToDB();
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
