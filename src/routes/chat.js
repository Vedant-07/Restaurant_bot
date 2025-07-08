const express = require("express");
const { analyzeMessage } = require("../bot/azureClu");

const searchRouter   = require("./searchRestaurant");
const viewMenuRouter = require("./viewMenu");

const router = express.Router();

router.post("/", async (req, res) => {
  const userText = req.body.message;
  if (!userText) return res.status(400).json({ error: "Missing message" });

  try {
    const prediction = await analyzeMessage(userText);
    const intent      = prediction.topIntent;
    const entities    = prediction.entities;

    switch (intent) {
      case "SearchRestaurant":
        return searchRouter.handle(req, res, entities);

      case "ViewMenu":
        return viewMenuRouter.handle(req, res, entities);

      default:
        return res.json({
          reply:
            "Sorry, I didn't understand. You can ask to find restaurants or view a menu."
        });
    }
  } catch (err) {
    console.error("🔴 Chat error:", err);
    return res.status(500).json({ reply: "Internal error, please try again." });
  }
});

module.exports = router;
